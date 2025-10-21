from rest_framework import viewsets
from .models import Clientes, OrdenConsumoLoteDetalle, OrdenVenta, DetallesOrdenVenta, OrdenConsumoLote, Pagos
from .serializers import ClientesSerializer, OrdenesSerializer, OrdenesDetallesSerializer
from apps.inventario.models import ProductosElaborados, ProductosReventa
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from apps.ventas.serializers import OrdenesTableSerializer
from rest_framework.decorators import action

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
            print( request.user.id)
            # Extract and remove productos from validated_data
            validated_data = serializer.validated_data.copy()
            productos_orden = validated_data.pop('productos')

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
        param = request.data.get('estado')
        orden = OrdenVenta.objects.get(id=pk)

        try:
            if param == 'En Proceso' and orden.estado_orden == 'PENDIENTE':
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
                        
                        lotes_detalles_consumo.append(
                            OrdenConsumoLoteDetalle(
                                **detalles_consumo_lotes,
                                orden_consumo_lote=orden_consumo_lote
                            )
                        )
                OrdenConsumoLoteDetalle.objects.bulk_create(lotes_detalles_consumo)
    
            orden.estado_orden = param
            orden.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=True, methods=['put'])
    def cancel_order(self, request, pk=None):
        orden = OrdenVenta.objects.get(id=pk)

        if orden.estado_orden == 'EN PROCESO':

            orden.estado_orden = 'CANCELADO'
            orden.save()
            return Response(status=status.HTTP_200_OK)
        
        return Response({"error": "No se puede cancelar una orden que no está en proceso"}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['put'])
    def register_payment_reference(self, request, pk=None):
        orden = OrdenVenta.objects.get(id=pk)
        try:
            Pagos.objects.create(
            orden_venta_asociada=orden,
            metodo_pago=orden.metodo_pago,
            monto_pago_usd=orden.monto_total_usd,
            monto_pago_ves=orden.monto_total_ves,
            fecha_pago=datetime.now(),
            referencia_pago=request.data.get('referencia_pago'),
            usuario_registrador=request.user,
            tasa_cambio_aplicada=orden.tasa_cambio
        )
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)