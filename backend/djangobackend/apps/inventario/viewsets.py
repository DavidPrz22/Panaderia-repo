from rest_framework import viewsets, status
from apps.inventario.models import MateriasPrimas, LotesMateriasPrimas, ProductosIntermedios, ProductosFinales, ProductosElaborados, LotesProductosElaborados
from apps.produccion.models import Recetas, RecetasDetalles, RelacionesRecetas    
from apps.inventario.serializers import ComponentesSearchSerializer, MateriaPrimaSerializer, LotesMateriaPrimaSerializer, ProductosIntermediosSerializer, ProductosFinalesSerializer, ProductosIntermediosDetallesSerializer, ProductosElaboradosSerializer, ProductosFinalesDetallesSerializer, ProductosFinalesSearchSerializer, ProductosIntermediosSearchSerializer, ProductosFinalesListaTransformacionSerializer, LotesProductosElaboradosSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime
from collections import defaultdict
from apps.inventario.models import LotesStatus


class MateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = MateriasPrimas.objects.all()
    serializer_class = MateriaPrimaSerializer


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

        MateriasPrimas.expirar_todos_lotes_viejos()

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


class ProductosIntermediosViewSet(viewsets.ModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosSerializer

    @action(detail=True, methods=['get'], url_path='lotes')
    def lotes(self, request, *args, **kwargs):
        producto_id = kwargs.get('pk')
        lotes = LotesProductosElaborados.objects.filter(producto_elaborado=producto_id)
        serializer = LotesProductosElaboradosSerializer(lotes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductosFinalesViewSet(viewsets.ModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesSerializer


class ProductosIntermediosDetallesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosDetallesSerializer


class ProductosFinalesDetallesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesDetallesSerializer


class ProductosFinalesSearchViewset(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesSearchSerializer


class ProductosFinalesListaTransformacionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosFinales.objects.all()
    serializer_class = ProductosFinalesListaTransformacionSerializer


class ProductosIntermediosSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosSearchSerializer

