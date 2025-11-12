from django.utils.timezone import timedelta
from rest_framework import viewsets
from apps.compras.models import Proveedores
from apps.compras.models import OrdenesCompra
from apps.compras.serializers import ProveedoresSerializer, CompraRegistroProveedoresSerializer, OrdenesCompraSerializer, OrdenesCompraTableSerializer, FormattedResponseOCSerializer, RecepcionCompraSerializer, PagosProveedoresSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from apps.compras.models import DetalleOrdenesCompra, EstadosOrdenCompra, Compras, DetalleCompras, PagosProveedores
from rest_framework import status, serializers
from apps.inventario.models import LotesMateriasPrimas, LotesProductosReventa
from apps.core.models import MetodosDePago
from django.db.models import Sum


class ProveedoresViewSet(viewsets.ModelViewSet):
    queryset = Proveedores.objects.all()
    serializer_class = ProveedoresSerializer

    @action(detail=False, methods=['get'])
    def compra_registro(self, request):
        queryset = Proveedores.objects.all()
        serializer = CompraRegistroProveedoresSerializer(queryset, many=True)
        return Response(serializer.data)


class OrdenesCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenesCompra.objects.all()
    serializer_class = OrdenesCompraSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)  # Call is_valid FIRST
            
            # NOW we can access validated_data
            detalles_data = serializer.validated_data.pop('detalles')
            
            # Save the orden and get the instance
            orden = OrdenesCompra.objects.create(**serializer.validated_data, usuario_creador=request.user) # or override perform_create to return the instance
            
            # Create detalles
            bulk_create_detalles = []
            # Change this part in your viewset:
            for detalle_data in detalles_data:
                materia_prima_obj = detalle_data.pop('materia_prima', None)
                producto_reventa_obj = detalle_data.pop('producto_reventa', None)
                unidad_medida_compra_obj = detalle_data.pop('unidad_medida_compra', None)
                
                if materia_prima_obj:
                    bulk_create_detalles.append(DetalleOrdenesCompra(
                        orden_compra=orden,
                        materia_prima=materia_prima_obj,  # Pass the object directly
                        unidad_medida_compra=unidad_medida_compra_obj,  # Pass the object directly
                        **detalle_data
                    ))
                elif producto_reventa_obj:
                    bulk_create_detalles.append(DetalleOrdenesCompra(
                        orden_compra=orden,
                        producto_reventa=producto_reventa_obj,  # Pass the object directly
                        unidad_medida_compra=unidad_medida_compra_obj,  # Pass the object directly
                        **detalle_data
                    ))
                else:
                    raise serializers.ValidationError("Debe seleccionar al menos un producto")
            DetalleOrdenesCompra.objects.bulk_create(bulk_create_detalles)
            
            # Return response
            orden_serializer = FormattedResponseOCSerializer(orden)
            return Response({
                "orden": orden_serializer.data, 
            }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def marcar_enviada(self, request, pk=None):
        orden = OrdenesCompra.objects.get(id=pk)
        orden.estado_oc = EstadosOrdenCompra.objects.get(nombre_estado='Enviada')
        orden.save()
        return Response({'message': 'Orden marcada como enviada'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def detalles(self, request, pk=None):
        try:
            orden = OrdenesCompra.objects.get(id=pk)
            serializer = FormattedResponseOCSerializer(orden)
            return Response({'orden': serializer.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        
    @action(detail=False, methods=['get'])
    def get_ordenes_table(self, request):
        queryset = OrdenesCompra.objects.all()
        serializer = OrdenesCompraTableSerializer(queryset, many=True)
        return Response(serializer.data)


# viewsets.py - Improved ComprasViewSet
class ComprasViewSet(viewsets.ModelViewSet):
    queryset = Compras.objects.all()
    serializer_class = RecepcionCompraSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = RecepcionCompraSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Extract validated data
            orden_compra_id = serializer.validated_data['orden_compra_id']
            fecha_recepcion = serializer.validated_data['fecha_recepcion']
            detalles_oc = serializer.validated_data['detalles']
            parcial = serializer.validated_data['recibido_parcialmente']

            # Fetch orden_compra with related data
            orden_compra = OrdenesCompra.objects.select_related(
                'proveedor', 'estado_oc'
            ).get(id=orden_compra_id)

            # Fetch all detalles at once (avoid N+1 queries)
            detalles_oc_ids = [d['detalle_oc_id'] for d in detalles_oc]
            detalles_orm = DetalleOrdenesCompra.objects.filter(
                id__in=detalles_oc_ids
            ).select_related('materia_prima', 'producto_reventa', 'unidad_medida_compra')
            
            # Create lookup dictionary for O(1) access
            detalles_dict = {d.id: d for d in detalles_orm}

            # Prepare bulk creates for lotes
            lotes_mp_bulk = []
            lotes_pr_bulk = []
            
            # Calculate actual reception amount
            monto_recepcion_usd = 0
            
            # mp map for stock update
            mp_map = {}
            # pr map for stock update
            pr_map = {}

            for detalle_data in detalles_oc:
                oc_detalle = detalles_dict[detalle_data['detalle_oc_id']]
                cantidad_total_recibida = detalle_data['cantidad_total_recibida']
                
                # Calculate subtotal for this line
                monto_recepcion_usd += cantidad_total_recibida * oc_detalle.costo_unitario_usd
                
                # Create lotes with individual quantities
                for lote_data in detalle_data['lotes']:
                    if oc_detalle.materia_prima:
                        mp_map[oc_detalle.materia_prima.id] = oc_detalle.materia_prima
                        lotes_mp_bulk.append(LotesMateriasPrimas(
                            materia_prima=oc_detalle.materia_prima,
                            proveedor=orden_compra.proveedor,
                            fecha_recepcion=fecha_recepcion,
                            fecha_caducidad=lote_data['fecha_caducidad'],
                            cantidad_recibida=lote_data['cantidad'],  # Individual lot quantity
                            stock_actual_lote=lote_data['cantidad'],  # Individual lot quantity
                            costo_unitario_usd=oc_detalle.costo_unitario_usd,
                            detalle_oc=oc_detalle
                        ))
                    elif oc_detalle.producto_reventa:
                        pr_map[oc_detalle.producto_reventa.id] = oc_detalle.producto_reventa
                        lotes_pr_bulk.append(LotesProductosReventa(
                            producto_reventa=oc_detalle.producto_reventa,
                            proveedor=orden_compra.proveedor,
                            fecha_recepcion=fecha_recepcion,
                            fecha_caducidad=lote_data['fecha_caducidad'],
                            cantidad_recibida=lote_data['cantidad'],  # Individual lot quantity
                            stock_actual_lote=lote_data['cantidad'],  # Individual lot quantity
                            coste_unitario_lote_usd=oc_detalle.costo_unitario_usd,
                            detalle_oc=oc_detalle
                        ))

            # Bulk create lotes (outside the loop)
            if lotes_mp_bulk:
                LotesMateriasPrimas.objects.bulk_create(lotes_mp_bulk)
                for mp in mp_map.values():
                    mp.actualizar_stock()
            if lotes_pr_bulk:
                LotesProductosReventa.objects.bulk_create(lotes_pr_bulk)
                for pr in pr_map.values():
                    pr.actualizar_product_stock()


            # CALCULO DE PAGOS

            # Calculate VES amount
            monto_recepcion_ves = monto_recepcion_usd * orden_compra.tasa_cambio_aplicada

            pagos_adelantados = PagosProveedores.objects.filter(
                orden_compra_asociada=orden_compra,
                compra_asociada__isnull=True  # Only advance payments
            ).aggregate(total=Sum('monto_pago_usd'))['total'] or 0

            # Adjust pending amount
            monto_pendiente_pago_usd = max(0, monto_recepcion_usd - pagos_adelantados)
            pagado = (monto_pendiente_pago_usd == 0)

            compra = Compras.objects.create(
                orden_compra=orden_compra,
                proveedor=orden_compra.proveedor,
                usuario_recepcionador=request.user,
                fecha_recepcion=fecha_recepcion,
                monto_recepcion_usd=monto_recepcion_usd,
                monto_recepcion_ves=monto_recepcion_ves,
                monto_pendiente_pago_usd=monto_pendiente_pago_usd,  # ✅ Accounts for advances
                pagado=pagado,  # ✅ May already be paid!
                tasa_cambio_aplicada=orden_compra.tasa_cambio_aplicada,
            )

            # Link advance payments to this new reception
            if pagos_adelantados > 0:
                PagosProveedores.objects.filter(
                    orden_compra_asociada=orden_compra,
                    compra_asociada__isnull=True
                ).update(compra_asociada=compra)


            # Create DetalleCompras records
            detalles_compra_bulk = []
            for detalle_data in detalles_oc:
                oc_detalle = detalles_dict[detalle_data['detalle_oc_id']]
                cantidad_total_recibida = detalle_data['cantidad_total_recibida']
                
                detalles_compra_bulk.append(DetalleCompras(
                    compra=compra,
                    detalle_oc=oc_detalle,
                    materia_prima=oc_detalle.materia_prima,
                    producto_reventa=oc_detalle.producto_reventa,
                    cantidad_recibida=cantidad_total_recibida,
                    unidad_medida=oc_detalle.unidad_medida_compra,
                    costo_unitario_usd=oc_detalle.costo_unitario_usd,
                    subtotal_usd=cantidad_total_recibida * oc_detalle.costo_unitario_usd,
                ))

            DetalleCompras.objects.bulk_create(detalles_compra_bulk)

            # Update cantidad_recibida in DetalleOrdenesCompra
            detalles_to_update = []
            for detalle_data in detalles_oc:
                oc_detalle = detalles_dict[detalle_data['detalle_oc_id']]
                oc_detalle.cantidad_recibida += detalle_data['cantidad_total_recibida']  # ALWAYS += for cumulative
                detalles_to_update.append(oc_detalle)
            
            # Bulk update
            DetalleOrdenesCompra.objects.bulk_update(
                detalles_to_update, 
                ['cantidad_recibida']
            )

            # Update orden_compra status
            if parcial:
                orden_compra.estado_oc = EstadosOrdenCompra.objects.get(
                    nombre_estado='Recibida Parcial'
                )
            else:
                orden_compra.estado_oc = EstadosOrdenCompra.objects.get(
                    nombre_estado='Recibida Completa'
                )
                orden_compra.fecha_entrega_real = fecha_recepcion
            
            orden_compra.save()

            # Refresh from DB to get updated data
            orden_compra.refresh_from_db()
            
            # Return response with updated order data
            response_serializer = FormattedResponseOCSerializer(orden_compra)
            
            return Response({
                'message': 'Compra parcialmente recibida' if parcial else 'Compra completamente recibida',
                'orden': response_serializer.data,
            }, status=status.HTTP_201_CREATED)


class PagosProveedoresViewSet(viewsets.ModelViewSet):
    queryset = PagosProveedores.objects.all()
    serializer_class = PagosProveedoresSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = PagosProveedoresSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Extract validated data
            orden_compra_asociada_id = serializer.validated_data.get('orden_compra_asociada', None)
            compra_asociada_id = serializer.validated_data.get('compra_asociada', None)
            metodo_pago_id = serializer.validated_data.get('metodo_pago', None)
            monto_pago_usd = serializer.validated_data.get('monto_pago_usd')
            monto_pago_ves = serializer.validated_data.get('monto_pago_ves', None)
            tasa_cambio_aplicada = serializer.validated_data.get('tasa_cambio_aplicada', None)
            fecha_pago = serializer.validated_data.get('fecha_pago', None)
            referencia_pago = serializer.validated_data.get('referencia_pago')
            notas = serializer.validated_data.get('notas', '')
            usuario_registrador = request.user

            # Fetch orden_compra - handle if not exists
            try:
                orden_compra_asociada = OrdenesCompra.objects.select_related('proveedor').get(id=orden_compra_asociada_id)
            except OrdenesCompra.DoesNotExist:
                return Response(
                    {'error': 'Orden de compra no encontrada'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Fetch compra_asociada - might not exist if paying before reception
            compra_asociada = Compras.objects.filter(id=compra_asociada_id).first()

            # Determine amount owed
            if compra_asociada:
                monto_a_pagar_usd = compra_asociada.monto_pendiente_pago_usd
            else:
                # Payment before reception - use OC total
                monto_a_pagar_usd = monto_pago_usd

            # Validate payment doesn't exceed owed amount
            if monto_pago_usd > monto_a_pagar_usd:
                return Response(
                    {
                        'error': f'El monto del pago (${monto_pago_usd}) excede el monto pendiente (${monto_a_pagar_usd})',
                        'monto_pendiente': str(monto_a_pagar_usd)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate remaining balance
            monto_pendiente_pago_usd = monto_a_pagar_usd - monto_pago_usd

            # Update compra if it exists
            if compra_asociada:
                compra_asociada.monto_pendiente_pago_usd = monto_pendiente_pago_usd
                compra_asociada.pagado = (monto_pendiente_pago_usd == 0)
                compra_asociada.save()

            # Fetch metodo_pago
            try:
                metodo_pago = MetodosDePago.objects.get(id=metodo_pago_id)
            except MetodosDePago.DoesNotExist:
                return Response(
                    {'error': 'Método de pago no encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Create the PagosProveedores record
            pago = PagosProveedores.objects.create(
                orden_compra_asociada=orden_compra_asociada,
                compra_asociada=compra_asociada,
                metodo_pago=metodo_pago,
                proveedor=orden_compra_asociada.proveedor,
                fecha_pago=fecha_pago,
                referencia_pago=referencia_pago,
                monto_pago_usd=monto_pago_usd,
                monto_pago_ves=monto_pago_ves,
                tasa_cambio_aplicada=tasa_cambio_aplicada,
                usuario_registrador=usuario_registrador,
                notas=notas
            )

            return Response({
                'message': 'Pago registrado correctamente',
                'pago_id': pago.id,
                'monto_pendiente_usd': str(monto_pendiente_pago_usd),
                'pagado_completamente': monto_pendiente_pago_usd == 0
            }, status=status.HTTP_201_CREATED)