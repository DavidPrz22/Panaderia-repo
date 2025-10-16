from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.inventario.models import ProductosElaborados, ProductosReventa

class ProductosPedidoSearchView(APIView):
    def get(self, request, *args, **kwargs):
        param = request.query_params.get('search')
        if not param:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "El parámetro 'search' es requerido"}
            )
        
        # Get ProductosElaborados using .values()
        productos = ProductosElaborados.objects.filter(
            nombre_producto__icontains=param,
            es_intermediario=False  # Only final products
        ).values('id', 'nombre_producto', 'unidad_venta__id', 'unidad_venta__abreviatura', 'SKU', 'precio_venta_usd', 'stock_actual')

        # Get ProductosReventa using .values()
        productos_reventa = ProductosReventa.objects.filter(
            nombre_producto__icontains=param
        ).values('id', 'nombre_producto', 'unidad_venta__id', 'unidad_venta__abreviatura', 'SKU', 'precio_venta_usd', 'stock_actual')

        # Convert to list and add 'tipo' field
        productos_list = [
            {
                'id': p['id'],
                'nombre_producto': p['nombre_producto'],
                'unidad_venta': {
                    'id': p['unidad_venta__id'],
                    'abreviatura': p['unidad_venta__abreviatura']
                } if p['unidad_venta__id'] else None,
                'SKU': p['SKU'],
                'precio_venta_usd': p['precio_venta_usd'],
                'stock_actual': p['stock_actual'],
                'tipo': 'producto-final'
            }
            for p in productos
        ]

        reventa_list = [
            {
                'id': p['id'],
                'nombre_producto': p['nombre_producto'],
                'unidad_venta': {
                    'id': p['unidad_venta__id'],
                    'abreviatura': p['unidad_venta__abreviatura']
                } if p['unidad_venta__id'] else None,
                'SKU': p['SKU'],
                'precio_venta_usd': p['precio_venta_usd'],
                'stock_actual': p['stock_actual'],
                'tipo': 'producto-reventa'
            }
            for p in productos_reventa
        ]
        
        # Combine and sort
        combined = productos_list + reventa_list
        combined.sort(key=lambda x: x['nombre_producto'].lower())
        
        return Response({"productos": combined}, status=status.HTTP_200_OK)