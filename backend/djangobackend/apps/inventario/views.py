from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.inventario.models import MateriasPrimas, ProductosElaborados, ProductosReventa

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


class ProductosComprasSearchView(APIView):
    def get(self, request, *args, **kwargs):
        param = request.query_params.get('search')
        if not param:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "El parámetro 'search' es requerido"}
            )
        
        # Get MateriasPrimas objects
        productos = MateriasPrimas.objects.filter(
            nombre__icontains=param
        ).select_related('unidad_medida_base')

        # Get ProductosReventa using .values()
        productos_reventa = ProductosReventa.objects.filter(
            nombre_producto__icontains=param
        ).select_related('unidad_base_inventario')

        # Convert to list and add 'tipo' field
        materias_primas_list = [
            {
                'id': p.id,
                'nombre': p.nombre,
                'unidad_medida_compra': {
                    'id': p.unidad_medida_base.id,
                    'abreviatura': p.unidad_medida_base.abreviatura,
                    'tipo_medida': p.unidad_medida_base.tipo_medida
                } if p.unidad_medida_base else None,
                'SKU': p.SKU,
                'precio_compra_usd': p.precio_compra_usd,
                'tipo': 'materia-prima'
            }
            for p in productos
        ]

        reventa_list = [
            {
                'id': p.id,
                'nombre': p.nombre_producto,
                'unidad_medida_compra': {
                    'id': p.unidad_base_inventario.id,
                    'abreviatura': p.unidad_base_inventario.abreviatura,
                    'tipo_medida': p.unidad_base_inventario.tipo_medida
                } if p.unidad_base_inventario else None,
                'SKU': p.SKU,
                'precio_compra_usd': p.precio_venta_usd,
                'tipo': 'producto-reventa'
            }
            for p in productos_reventa
        ]
        
        # Combine and sort
        combined = materias_primas_list + reventa_list
        combined.sort(key=lambda x: x['nombre'].lower())
        
        return Response({"productos": combined}, status=status.HTTP_200_OK)