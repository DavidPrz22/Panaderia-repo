from apps.core.models import EstadosOrdenVenta
from rest_framework import viewsets
from .models import Clientes, OrdenConsumoLoteDetalle, OrdenVenta, DetallesOrdenVenta, OrdenConsumoLote, Pagos
from .serializers import ClientesSerializer, OrdenesSerializer, OrdenesDetallesSerializer
from apps.inventario.models import ProductosElaborados, ProductosReventa
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from apps.ventas.serializers import OrdenesTableSerializer
from rest_framework.decorators import action
from datetime import datetime
from apps.inventario.models import LotesStatus

class ClientesViewSet(viewsets.ModelViewSet):
    queryset = Clientes.objects.all()
    serializer_class = ClientesSerializer


class OrdenesViewSet(viewsets.ModelViewSet):
    queryset = OrdenVenta.objects.all()
    serializer_class = OrdenesSerializer

    def create(self, request, *args, **kwargs):

        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Extract and remove productos from validated_data
            validated_data = serializer.validated_data.copy()
            productos_orden = validated_data.pop('productos')
            referencia_pago = validated_data.pop('referencia_pago', None)
            
            # Add user creator
            validated_data['usuario_creador_id'] = request.user.id if request.user.id else 2

            # Create the order
            orden_venta = OrdenVenta.objects.create(**validated_data)

            # Prefetch products to avoid N+1 queries
            elaborado_ids = [p['producto']['id'] for p in productos_orden 
                            if p['producto']['tipo_producto'] == 'producto-final']
            reventa_ids = [p['producto']['id'] for p in productos_orden 
                        if p['producto']['tipo_producto'] != 'producto-final']

            productos_elaborados_map = {
                p.id: p for p in ProductosElaborados.objects.filter(id__in=elaborado_ids)
            } if elaborado_ids else {}
            productos_reventa_map = {
                p.id: p for p in ProductosReventa.objects.filter(id__in=reventa_ids)
            } if reventa_ids else {}

            # Build detail objects without saving
            detalles_to_create = []
            for producto in productos_orden:
                producto_id = producto['producto']['id']
                
                if producto['producto']['tipo_producto'] == 'producto-final':
                    producto_elaborado = productos_elaborados_map.get(producto_id)
                    if not producto_elaborado:
                        raise ValueError(f"Product {producto_id} not found")
                    detalle = DetallesOrdenVenta(
                        orden_venta_asociada=orden_venta,
                        producto_elaborado=producto_elaborado,
                        producto_reventa=None,
                        cantidad_solicitada=producto['cantidad_solicitada'],
                        unidad_medida_id=producto['unidad_medida'],
                        precio_unitario_usd=producto['precio_unitario_usd'],
                        subtotal_linea_usd=producto['subtotal_linea_usd'],
                        descuento_porcentaje=producto['descuento_porcentaje'],
                        impuesto_porcentaje=producto['impuesto_porcentaje'],
                    )
                else:
                    producto_reventa = productos_reventa_map.get(producto_id)
                    if not producto_reventa:
                        raise ValueError(f"Product {producto_id} not found")
                    detalle = DetallesOrdenVenta(
                        orden_venta_asociada=orden_venta,
                        producto_elaborado=None,
                        producto_reventa=producto_reventa,
                        cantidad_solicitada=producto['cantidad_solicitada'],
                        unidad_medida_id=producto['unidad_medida'],
                        precio_unitario_usd=producto['precio_unitario_usd'],
                        subtotal_linea_usd=producto['subtotal_linea_usd'],
                        descuento_porcentaje=producto['descuento_porcentaje'],
                        impuesto_porcentaje=producto['impuesto_porcentaje'],
                    )
                detalles_to_create.append(detalle)

            # Single bulk insert
            DetallesOrdenVenta.objects.bulk_create(detalles_to_create)

            # Register payment if reference is provided
            if referencia_pago:
                self.register_payment(orden_venta, referencia_pago, request.user)

            # Return the created order data
            response_serializer = self.get_serializer(orden_venta)
            headers = self.get_success_headers(response_serializer.data)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def get_ordenes_table(self, request):

        ordenes = OrdenVenta.objects.all()
        serializer = OrdenesTableSerializer(ordenes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_orden_detalles(self, request, pk=None):
        orden = OrdenVenta.objects.get(id=pk)
        serializer = OrdenesDetallesSerializer(orden)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        
        with transaction.atomic():
            # Get the existing order
            instance = self.get_object()
            
            # Validate the incoming data
            serializer = self.get_serializer(instance, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)
            
            # Extract validated data
            validated_data = serializer.validated_data.copy()
            productos_orden = validated_data.pop('productos')
            
            # Update payment reference (allow clearing by setting to None/empty)
            if 'referencia_pago' in serializer.validated_data:
                referencia_pago = validated_data.pop('referencia_pago', None)
                self.update_payment(instance, referencia_pago, request.user)

            # Update the order fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            
            # Delete existing order details
            DetallesOrdenVenta.objects.filter(orden_venta_asociada=instance).delete()
            
            # Prefetch products to avoid N+1 queries
            elaborado_ids = [p['producto']['id'] for p in productos_orden 
                            if p['producto']['tipo_producto'] == 'producto-final']
            reventa_ids = [p['producto']['id'] for p in productos_orden 
                        if p['producto']['tipo_producto'] != 'producto-final']

            productos_elaborados_map = {
                p.id: p for p in ProductosElaborados.objects.filter(id__in=elaborado_ids)
            } if elaborado_ids else {}
            productos_reventa_map = {
                p.id: p for p in ProductosReventa.objects.filter(id__in=reventa_ids)
            } if reventa_ids else {}

            # Build detail objects without saving
            detalles_to_create = []
            for producto in productos_orden:
                producto_id = producto['producto']['id']
                
                if producto['producto']['tipo_producto'] == 'producto-final':
                    producto_elaborado = productos_elaborados_map.get(producto_id)
                    if not producto_elaborado:
                        raise ValueError(f"Product {producto_id} not found")
                    detalle = DetallesOrdenVenta(
                        orden_venta_asociada=instance,
                        producto_elaborado=producto_elaborado,
                        producto_reventa=None,
                        cantidad_solicitada=producto['cantidad_solicitada'],
                        unidad_medida_id=producto['unidad_medida'],
                        precio_unitario_usd=producto['precio_unitario_usd'],
                        subtotal_linea_usd=producto['subtotal_linea_usd'],
                        descuento_porcentaje=producto['descuento_porcentaje'],
                        impuesto_porcentaje=producto['impuesto_porcentaje'],
                    )
                else:
                    producto_reventa = productos_reventa_map.get(producto_id)
                    if not producto_reventa:
                        raise ValueError(f"Product {producto_id} not found")
                    detalle = DetallesOrdenVenta(
                        orden_venta_asociada=instance,
                        producto_elaborado=None,
                        producto_reventa=producto_reventa,
                        cantidad_solicitada=producto['cantidad_solicitada'],
                        unidad_medida_id=producto['unidad_medida'],
                        precio_unitario_usd=producto['precio_unitario_usd'],
                        subtotal_linea_usd=producto['subtotal_linea_usd'],
                        descuento_porcentaje=producto['descuento_porcentaje'],
                        impuesto_porcentaje=producto['impuesto_porcentaje'],
                    )
                detalles_to_create.append(detalle)

            # Single bulk insert
            DetallesOrdenVenta.objects.bulk_create(detalles_to_create)

            # Return the updated order data
            response_serializer = OrdenesDetallesSerializer(instance)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
            
            
    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        try:
            with transaction.atomic():
                param = request.GET.get('estado')
                orden = OrdenVenta.objects.get(id=pk)
    
                estado_id = EstadosOrdenVenta.objects.filter(nombre_estado=param).values_list('id', flat=True).first()
                if param == 'En Proceso' and orden.estado_orden.nombre_estado == 'Pendiente':
                    detallesOrdenVenta = DetallesOrdenVenta.objects.filter(orden_venta_asociada=orden)
                    lotes_detalles_consumo = []

                    for detalle in detallesOrdenVenta:
                        cantidad_consumir = detalle.cantidad_solicitada
                        price = detalle.precio_unitario_usd
                        producto = detalle.producto_elaborado if detalle.producto_elaborado else detalle.producto_reventa
                            
                        if producto:
                            detalles_consumo_lotes = producto.consume_product_stock(cantidad_consumir, price)
                            producto.actualizar_product_stock()
                            
                            orden_consumo_lote = OrdenConsumoLote.objects.create(
                                orden_venta_asociada=orden,
                                detalle_orden_venta=detalle
                            )
                            
                            for detalle_consumo_lote in detalles_consumo_lotes:
                                lotes_detalles_consumo.append(
                                    OrdenConsumoLoteDetalle(
                                        **detalle_consumo_lote,
                                        orden_consumo_lote=orden_consumo_lote
                                    )
                                )
                    OrdenConsumoLoteDetalle.objects.bulk_create(lotes_detalles_consumo)
            
                orden.estado_orden = EstadosOrdenVenta.objects.get(id=estado_id)
                orden.save()
                return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['put'])
    def cancel(self, request, pk=None):
        try:
            with transaction.atomic():
                orden = OrdenVenta.objects.get(id=pk)

                if orden.estado_orden.nombre_estado == 'En Proceso':

                    consumo_lote = OrdenConsumoLote.objects.filter(orden_venta_asociada=orden)
                    consumo_lote_detalle = OrdenConsumoLoteDetalle.objects.filter(orden_consumo_lote__in=consumo_lote)

                    for lote in consumo_lote_detalle:
                        if lote.lote_producto_elaborado:
                            self.actualizar_lote(lote.lote_producto_elaborado, lote.cantidad_consumida)
                            lote.lote_producto_elaborado.producto_elaborado.actualizar_product_stock()

                        elif lote.lote_producto_reventa:
                            self.actualizar_lote(lote.lote_producto_reventa, lote.cantidad_consumida)
                            lote.lote_producto_reventa.producto_reventa.actualizar_product_stock()
            
                    orden.estado_orden = EstadosOrdenVenta.objects.filter(nombre_estado='Cancelado').first()
                    orden.save()
                    return Response(status=status.HTTP_200_OK)
                elif orden.estado_orden.nombre_estado == 'Pendiente':
                    orden.estado_orden = EstadosOrdenVenta.objects.filter(nombre_estado='Cancelado').first()
                    orden.save()
                    return Response(status=status.HTTP_200_OK)
                return Response({"error": "No se puede cancelar una orden que no está en proceso"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def actualizar_lote(self, lote, cantidad_consumida):
        # Restore the consumed quantity back to the lot
        lote.stock_actual_lote += cantidad_consumida
        
        # If the lot was marked as depleted, make it available again
        if lote.estado == LotesStatus.AGOTADO:
            lote.estado = LotesStatus.DISPONIBLE
        
        lote.save()
    
    def register_payment(self, orden, ref, user):
        try:
            Pagos.objects.create(
                orden_venta_asociada=orden,
                metodo_pago=orden.metodo_pago,
                monto_pago_usd=orden.monto_total_usd,
                monto_pago_ves=orden.monto_total_ves,
                fecha_pago=datetime.now(),
                referencia_pago=ref,
                usuario_registrador=user,
                tasa_cambio_aplicada=orden.tasa_cambio_aplicada
            )
            return True
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update_payment(self, orden, ref, user):
        try:
            existing_payment = Pagos.objects.filter(orden_venta_asociada=orden).first()
            if existing_payment:
                existing_payment.referencia_pago = ref
                existing_payment.usuario_registrador = user
                existing_payment.save()
            elif ref: 
                self.register_payment(orden, ref, user)
            return True
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'])
    def register_payment_reference(self, request, pk=None):
        orden = OrdenVenta.objects.get(id=pk)
        ref = request.data.get('referencia_pago')

        self.register_payment(orden, ref, request.user)
        return Response(status=status.HTTP_200_OK)