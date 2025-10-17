from rest_framework import viewsets
from .models import Clientes, OrdenVenta, DetallesOrdenVenta
from .serializers import ClientesSerializer, OrdenesSerializer
from apps.inventario.models import ProductosElaborados, ProductosReventa
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status

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