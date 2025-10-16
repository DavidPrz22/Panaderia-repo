from rest_framework import viewsets, status
from apps.inventario.models import MateriasPrimas, LotesMateriasPrimas, ProductosIntermedios, ProductosFinales, ProductosElaborados, LotesProductosElaborados, ProductosReventa, LotesProductosReventa, ComponentesStockManagement
from apps.produccion.models import Recetas, RecetasDetalles, RelacionesRecetas
from apps.inventario.serializers import ComponentesSearchSerializer, MateriaPrimaSerializer, LotesMateriaPrimaSerializer, ProductosIntermediosSerializer, ProductosFinalesSerializer, ProductosIntermediosDetallesSerializer, ProductosElaboradosSerializer, ProductosFinalesDetallesSerializer, ProductosFinalesSearchSerializer, ProductosIntermediosSearchSerializer, ProductosFinalesListaTransformacionSerializer, LotesProductosElaboradosSerializer, ProductosReventaSerializer, ProductosReventaDetallesSerializer, LotesProductosReventaSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime
from collections import defaultdict
from apps.inventario.models import LotesStatus

class MateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = MateriasPrimas.objects.all()
    serializer_class = MateriaPrimaSerializer

    def retrieve(self, request, *args, **kwargs):
        """Retrieve materia prima details after expiring old lots"""
        # Expire all old lots before returning details
        ComponentesStockManagement.expirar_todos_lotes_viejos()
        
        return super().retrieve(request, *args, **kwargs)


class ComponenteSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MateriasPrimas.objects.none()
    serializer_class = ComponentesSearchSerializer

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search')
        stock_requested = request.query_params.get('stock')

        if not search_query:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "El parámetro 'search' es requerido"})

        materia_primas = MateriasPrimas.objects.filter(
            nombre__icontains=search_query
        ).select_related('categoria')

        productos_intermedios = ProductosIntermedios.objects.filter(
            nombre_producto__icontains=search_query
        ).select_related('categoria')

        categorias_dict = defaultdict(list)
        for materia_prima in materia_primas:
            categoria = materia_prima.categoria.nombre_categoria
            componente_data = {
                'id': materia_prima.id, 
                'nombre': materia_prima.nombre,
                'tipo': 'MateriaPrima',
                'unidad_medida': materia_prima.unidad_medida_base.abreviatura
            }
            if stock_requested: 
                componente_data['stock'] = materia_prima.stock_actual

            categorias_dict[categoria].append(componente_data)

        for intermedio in productos_intermedios:
            categoria = intermedio.categoria.nombre_categoria
            componente_data = {
                'id': intermedio.id,
                'nombre': intermedio.nombre_producto,
                'tipo': 'ProductoIntermedio',
                'unidad_medida': intermedio.unidad_produccion.abreviatura
            }
            if stock_requested:
                componente_data['stock'] = intermedio.stock_actual

            categorias_dict[categoria].append(componente_data)

        # Use the serializer to format the data
        componentes_por_categoria = []
        for categoria, items in categorias_dict.items():
            serializer = self.get_serializer(items, many=True)
            componentes_por_categoria.append({categoria: serializer.data})

        return Response(componentes_por_categoria)


class LotesMateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = LotesMateriasPrimas.objects.all()
    serializer_class = LotesMateriaPrimaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        materia_prima = self.request.query_params.get('materia_prima')
        if materia_prima:
            queryset = queryset.filter(materia_prima=materia_prima)
        return queryset

    def list(self, request, *args, **kwargs):
        """List lots after expiring old ones"""
        # Get materia_prima parameter
        materia_prima_id = request.query_params.get('materia_prima')
        
        # If filtering by materia prima, expire lots for that material
        if materia_prima_id:
            try:
                materia_prima = MateriasPrimas.objects.get(id=materia_prima_id)
                materia_prima.expirar_lotes_viejos()
            except MateriasPrimas.DoesNotExist:
                pass
        else:
            # Expire all lots if no filter
            ComponentesStockManagement.expirar_todos_lotes_viejos()
        
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.validated_data['stock_actual_lote'] = serializer.validated_data['cantidad_recibida']

        # Save only once through perform_create
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    @action(detail=True, methods=['put'], url_path='inactivar')
    def inactivar(self, request, pk=None):
        try:
            # Inactivar
            lote_inactivar = LotesMateriasPrimas.objects.get(id=pk)

            if lote_inactivar.fecha_caducidad > datetime.now().date():
                lote_inactivar.estado = LotesStatus.INACTIVO
                materia_prima = lote_inactivar.materia_prima
                lote_inactivar.save(update_fields=['estado'])
                materia_prima.actualizar_stock()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST, 
                    data={"error": "Este Lote ya caducó"}
                )
                
        except LotesMateriasPrimas.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, 
                data={"error": "Lote no encontrado"}
            )

    @action(detail=True, methods=['put'], url_path='activar')
    def activar(self, request, pk=None):
        try:
            # Activar
            lote_activar = LotesMateriasPrimas.objects.get(id=pk)

            if lote_activar.fecha_caducidad > datetime.now().date():
                lote_activar.estado = LotesStatus.DISPONIBLE
                materia_prima = lote_activar.materia_prima
                lote_activar.save(update_fields=['estado'])
                materia_prima.actualizar_stock()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST, 
                    data={"error": "Este Lote ya caducó"}
                )
                
        except LotesMateriasPrimas.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, 
                data={"error": "Lote no encontrado"}
            )


class ProductosElaboradosViewSet(viewsets.ModelViewSet):
    queryset = ProductosElaborados.objects.all()
    serializer_class = ProductosElaboradosSerializer

    @action(detail=True, methods=['post'], url_path='clear-receta-relacionada')
    def clear_receta_relacionada(self, request, *args, **kwargs):
        producto_id = kwargs.get('pk')
        receta = Recetas.objects.filter(producto_elaborado=producto_id)
        if receta.exists():
            receta.update(producto_elaborado=None)
        return Response(status=status.HTTP_200_OK)

    def _get_component_data(self, detalle):
        """Helper function to extract component data from a RecetasDetalles instance."""
        if detalle.componente_materia_prima:
            component = detalle.componente_materia_prima
            cantidad = detalle.cantidad
            unit = component.unidad_medida_base
            return {
                "id": component.id,
                "nombre": component.nombre,
                "unidad_medida": unit.abreviatura,
                "stock": component.stock_actual,
                "cantidad": cantidad,
            }
        elif detalle.componente_producto_intermedio:
            component = detalle.componente_producto_intermedio
            cantidad = detalle.cantidad
            unit = component.unidad_produccion
            return {
                "id": component.id,
                "nombre": component.nombre_producto,
                "unidad_medida": unit.abreviatura,
                "stock": component.stock_actual,
                "cantidad": cantidad,
            }
        return None

    def _get_all_sub_recetas(self, receta_principal_id, subrecetas_lista: list):
        """Recursively fetches all sub-recipes and their components."""

        sub_relaciones = RelacionesRecetas.objects.filter(receta_principal_id=receta_principal_id).select_related('subreceta')
        
        if not sub_relaciones.exists():
            return []

        sub_recetas_ids = [rel.subreceta_id for rel in sub_relaciones]
        
        # Fetch all details for all sub-recipes in one go to avoid N+1 queries
        all_detalles = RecetasDetalles.objects.filter(
            receta_id__in=sub_recetas_ids
        ).select_related(
            'componente_materia_prima__unidad_medida_base',
            'componente_producto_intermedio__unidad_produccion'
        )

        # Group details by recipe id for efficient lookup
        detalles_map = defaultdict(list)
        for detalle in all_detalles:
            detalles_map[detalle.receta_id].append(detalle)

        for relacion in sub_relaciones:
            subreceta = relacion.subreceta
            componentes = [self._get_component_data(d) for d in detalles_map.get(subreceta.id, []) if d is not None]
            
            # Recursively find children of the current sub-recipe

            subrecetas_lista.append({
                'nombre': subreceta.nombre,
                'componentes': componentes,
            })

            self._get_all_sub_recetas(subreceta.id, subrecetas_lista)

    @action(detail=True, methods=['get'], url_path='get-receta-producto')
    def get_receta_producto(self, request, *args, **kwargs):
        producto_id = kwargs.get('pk')
        try:
            receta_principal = Recetas.objects.get(producto_elaborado=producto_id)
        except Recetas.DoesNotExist:
            return Response({"error": "No se encontró la receta asociada"}, status=status.HTTP_404_NOT_FOUND)

        # Expire all old lots before getting recipe data
        ComponentesStockManagement.expirar_todos_lotes_viejos()

        detalles_receta_principal = RecetasDetalles.objects.filter(
            receta_id=receta_principal.id
        ).select_related(
            'componente_materia_prima__unidad_medida_base',
            'componente_producto_intermedio__unidad_produccion'
        )

        subrecetas = []
        self._get_all_sub_recetas(receta_principal.id, subrecetas)
        # Derive unit-based production flags from product's unidad_produccion
        producto_elaborado = receta_principal.producto_elaborado
        unidad_prod = getattr(producto_elaborado, 'unidad_produccion', None)
        medida_produccion = getattr(unidad_prod, 'nombre_completo', None)
        es_por_unidad = False
        try:
            # Normalize and compare
            es_por_unidad = (str(medida_produccion).strip().lower() == 'unidad') if medida_produccion else False
        except Exception:
            es_por_unidad = False

        producto_data = {
            'componentes': [self._get_component_data(d) for d in detalles_receta_principal if d is not None],
            'subrecetas': subrecetas,
            'medida_produccion': medida_produccion,
            'es_por_unidad': es_por_unidad,
            'tipo_medida_fisica': producto_elaborado.tipo_medida_fisica,
        }

        return Response(producto_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='lotes')
    def lotes(self, request, *args, **kwargs):
        producto_id = kwargs.get('pk')
        
        # Expire old lots before returning lot information
        try:
            producto = ProductosElaborados.objects.get(id=producto_id)
            # Use the expirar_todos_lotes_viejos for ProductosElaborados
            ComponentesStockManagement.expirar_todos_lotes_viejos()
        except ProductosElaborados.DoesNotExist:
            pass
        
        lotes = LotesProductosElaborados.objects.filter(producto_elaborado=producto_id)
        serializer = LotesProductosElaboradosSerializer(lotes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class ProductosPedidoSearchViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = ProductosElaborados.objects.all()

#     def list(self, request, *args, **kwargs):
#         param = request.query_params.get('search')
#         if not param:
#             return Response(
#                 status=status.HTTP_400_BAD_REQUEST,
#                 data={"error": "El parámetro 'search' es requerido"}
#             )
        
#         # Get ProductosElaborados using .values()
#         productos = ProductosElaborados.objects.filter(
#             nombre_producto__icontains=param,
#             es_intermediario=False  # Only final products
#         ).values('id', 'nombre_producto', 'unidad_venta__nombre', 'SKU', 'precio_venta_usd')
        
#         # Get ProductosReventa using .values()
#         productos_reventa = ProductosReventa.objects.filter(
#             nombre_producto__icontains=param
#         ).values('id', 'nombre_producto', 'unidad_venta__nombre', 'SKU', 'precio_venta_usd')
        
#         # Convert to list and add 'tipo' field
#         productos_list = [
#             {
#                 'id': p['id'],
#                 'nombre_producto': p['nombre_producto'],
#                 'unidad_venta': p['unidad_venta__nombre'],
#                 'SKU': p['SKU'],
#                 'precio_venta_usd': p['precio_venta_usd'],
#                 'tipo': 'producto-elaborado'
#             }
#             for p in productos
#         ]
        
#         reventa_list = [
#             {
#                 'id': p['id'],
#                 'nombre_producto': p['nombre_producto'],
#                 'unidad_venta': p['unidad_venta__nombre'],
#                 'SKU': p['SKU'],
#                 'precio_venta_usd': p['precio_venta_usd'],
#                 'tipo': 'producto-reventa'
#             }
#             for p in productos_reventa
#         ]
        
#         # Combine and sort
#         combined = productos_list + reventa_list
#         combined.sort(key=lambda x: x['nombre_producto'].lower())
        
#         return Response({"productos": combined}, status=status.HTTP_200_OK)


class LotesProductosElaboradosViewSet(viewsets.ModelViewSet):
    queryset = LotesProductosElaborados.objects.all()
    serializer = LotesProductosElaboradosSerializer
    
    def list(self, request, *args, **kwargs):
        """List lots after expiring old ones"""
        # Expire all old lots before returning list
        ComponentesStockManagement.expirar_todos_lotes_viejos()
        
        return super().list(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'], url_path='change-estado-lote')
    def change_estado_lote(self, request, *args, **kwargs):
        try:
            lote_id = kwargs.get('pk')
            lote = LotesProductosElaborados.objects.get(id=lote_id)
            producto = lote.producto_elaborado
            if lote.estado == 'DISPONIBLE':
                if lote.fecha_caducidad > datetime.now().date():
                    lote.estado = LotesStatus.INACTIVO
                    lote.save(update_fields=['estado'])
                    producto.actualizar_stock()
                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST, 
                        data={"error": "Este Lote ya caducó"}
                    )
            elif lote.estado == 'INACTIVO':

                if lote.fecha_caducidad > datetime.now().date():
                    lote.estado = LotesStatus.DISPONIBLE
                    lote.save(update_fields=['estado'])
                    producto.actualizar_stock()
                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST, 
                        data={"error": "Este Lote ya caducó"}
                    )
        
            return Response({"message": "Estado del lote cambiado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductosIntermediosViewSet(viewsets.ModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosSerializer


class ProductosFinalesViewSet(viewsets.ModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesSerializer


class ProductosIntermediosDetallesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosDetallesSerializer

    def retrieve(self, request, *args, **kwargs):
        """Retrieve product details after expiring old lots"""
        # Expire all old lots before returning details
        ComponentesStockManagement.expirar_todos_lotes_viejos()
        
        return super().retrieve(request, *args, **kwargs)


class ProductosFinalesDetallesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesDetallesSerializer

    def retrieve(self, request, *args, **kwargs):
        """Retrieve product details after expiring old lots"""
        # Expire all old lots before returning details
        ComponentesStockManagement.expirar_todos_lotes_viejos()
        
        return super().retrieve(request, *args, **kwargs)


class ProductosFinalesSearchViewset(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesSearchSerializer


class ProductosFinalesListaTransformacionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesListaTransformacionSerializer


class ProductosIntermediosSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosSearchSerializer


class ProductosReventaViewSet(viewsets.ModelViewSet):
    queryset = ProductosReventa.objects.all()
    serializer_class = ProductosReventaSerializer

class ProductosReventaDetallesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosReventa.objects.all()
    serializer_class = ProductosReventaDetallesSerializer

    def retrieve(self, request, *args, **kwargs):
        """Retrieve product details after expiring old lots"""
        instance = self.get_object()
        
        # Expire old lots for this specific product before returning details
        instance.expirar_lotes_viejos()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class LotesProductosReventaViewSet(viewsets.ModelViewSet):
    queryset = LotesProductosReventa.objects.all()
    serializer_class = LotesProductosReventaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        producto_reventa = self.request.query_params.get('producto_reventa')
        if producto_reventa:
            queryset = queryset.filter(producto_reventa=producto_reventa)
        return queryset

    def list(self, request, *args, **kwargs):
        """List lots after expiring old ones"""
        # Get producto_reventa parameter
        producto_reventa_id = request.query_params.get('producto_reventa')
        
        # If filtering by product, expire lots for that product
        if producto_reventa_id:
            try:
                producto = ProductosReventa.objects.get(id=producto_reventa_id)
                producto.expirar_lotes_viejos()
            except ProductosReventa.DoesNotExist:
                pass
        else:
            # Expire all ProductosReventa lots if no filter
            ProductosReventa.expirar_todos_lotes_viejos()
        
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Set stock_actual_lote equal to cantidad_recibida on creation
        serializer.validated_data['stock_actual_lote'] = serializer.validated_data['cantidad_recibida']

        # Save through perform_create
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['get'], url_path='change-estado-lote')
    def change_estado_lote(self, request, *args, **kwargs):
        try:
            lote_id = kwargs.get('pk')
            lote = LotesProductosReventa.objects.get(id=lote_id)
            if lote.estado == 'DISPONIBLE':
                if lote.fecha_caducidad > datetime.now().date():
                    lote.estado = LotesStatus.INACTIVO
                    lote.save(update_fields=['estado'])
                    # Stock will be automatically updated by the signal
                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST, 
                        data={"error": "Este Lote ya caducó"}
                    )
            elif lote.estado == 'INACTIVO':
                if lote.fecha_caducidad > datetime.now().date():
                    lote.estado = LotesStatus.DISPONIBLE
                    lote.save(update_fields=['estado'])
                    # Stock will be automatically updated by the signal
                else:
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST, 
                        data={"error": "Este Lote ya caducó"}
                    )
        
            return Response({"message": "Estado del lote cambiado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)