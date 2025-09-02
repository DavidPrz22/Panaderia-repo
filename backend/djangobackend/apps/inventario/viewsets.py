from rest_framework import viewsets, status
from apps.inventario.models import MateriasPrimas, LotesMateriasPrimas, ProductosIntermedios, ProductosFinales, ProductosElaborados
from apps.produccion.models import Recetas, RecetasDetalles, RelacionesRecetas    
from apps.inventario.serializers import ComponentesSearchSerializer, MateriaPrimaSerializer, LotesMateriaPrimaSerializer, ProductosIntermediosSerializer, ProductosFinalesSerializer, ProductosIntermediosDetallesSerializer, ProductosElaboradosSerializer, ProductosFinalesDetallesSerializer, ProductosFinalesSearchSerializer, ProductosIntermediosSearchSerializer
from django.db.models import Min
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime
from collections import defaultdict

class MateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = MateriasPrimas.objects.all()
    serializer_class = MateriaPrimaSerializer


class ComponenteSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MateriasPrimas.objects.none()
    serializer_class = ComponentesSearchSerializer

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search')
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
            categorias_dict[categoria].append({
                'id': materia_prima.id, 
                'nombre': materia_prima.nombre,
                'tipo': 'MateriaPrima',
                'unidad_medida': materia_prima.unidad_medida_base.abreviatura
            })

        for intermedio in productos_intermedios:
            categoria = intermedio.categoria.nombre_categoria
            categorias_dict[categoria].append({
                'id': intermedio.id,
                'nombre': intermedio.nombre_producto,
                'tipo': 'ProductoIntermedio',
                'unidad_medida': intermedio.unidad_medida_nominal.abreviatura
            })

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

        materia_prima_id = serializer.validated_data['materia_prima']
        lotes_materia_prima = LotesMateriasPrimas.objects.filter(materia_prima=materia_prima_id)

        # Get the closest expiration date from existing lots
        aggregation = lotes_materia_prima.aggregate(closest_date=Min('fecha_caducidad'))
        closest_date = aggregation['closest_date']

        new_fecha_caducidad = serializer.validated_data['fecha_caducidad']

        if closest_date is None:
            # If there are no existing lots, this is the first one and should be active
            serializer.validated_data['activo'] = True
            serializer.validated_data['stock_actual_lote'] = serializer.validated_data['cantidad_recibida']
        elif new_fecha_caducidad < closest_date:
            # If the new lot expires sooner than any existing lot
            # Set this one as active and deactivate all others
            serializer.validated_data['activo'] = True
            serializer.validated_data['stock_actual_lote'] = serializer.validated_data['cantidad_recibida']
            lotes_materia_prima.update(activo=False)
        else:
            # If the new lot expires later than or equal to the closest existing lot
            # Keep it inactive
            serializer.validated_data['activo'] = False
            serializer.validated_data['stock_actual_lote'] = serializer.validated_data['cantidad_recibida']

        # Save only once through perform_create
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

    @action(detail=True, methods=['put'], url_path='activate')
    def activate(self, request, pk=None):
        try:
            lote_por_activar = LotesMateriasPrimas.objects.get(id=pk)
            
            # Convert to datetime.date for comparison since fecha_caducidad is a DateField
            if datetime.now().date() < lote_por_activar.fecha_caducidad:
                # First deactivate current active lote of the same materia prima
                LotesMateriasPrimas.objects.filter(
                    materia_prima=lote_por_activar.materia_prima, 
                    activo=True
                ).update(activo=False)
                
                # Activate the new lote
                lote_por_activar.activo = True
                lote_por_activar.save()
                
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
            unit = component.unidad_medida_nominal
            return {
                "id": component.id,
                "nombre": component.nombre_producto,
                "unidad_medida": unit.abreviatura,
                "stock": component.stock_actual,
                "cantidad": cantidad,
            }
        return None

    @action(detail=True, methods=['post'], url_path='get-receta-producto')
    def get_receta_producto(self, request, *args, **kwargs):
        producto_id = kwargs.get('pk')
        try:
            receta_principal = Recetas.objects.get(producto_elaborado=producto_id)
        except Recetas.DoesNotExist:
            return Response({"error": "No se encontró la receta asociada"}, status=status.HTTP_404_NOT_FOUND)

        subreceta_ids = list(RelacionesRecetas.objects.filter(
            receta_principal=receta_principal
        ).values_list('subreceta_id', flat=True))

        all_recipe_ids = [receta_principal.id] + subreceta_ids

        detalles = RecetasDetalles.objects.filter(
            receta_id__in=all_recipe_ids
        ).select_related(
            'componente_materia_prima__unidad_medida_base',
            'componente_producto_intermedio__unidad_medida_nominal'
        )
        data_receta = [self._get_component_data(d) for d in detalles if self._get_component_data(d) is not None]

        return Response(data_receta, status=status.HTTP_200_OK)


class ProductosIntermediosViewSet(viewsets.ModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosSerializer


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



class ProductosIntermediosSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductosIntermedios.objects.all()
    serializer_class = ProductosIntermediosSearchSerializer

