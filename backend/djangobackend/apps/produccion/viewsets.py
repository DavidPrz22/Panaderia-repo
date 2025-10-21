from apps.users.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from apps.produccion.models import Produccion, DetalleProduccionCosumos
from apps.produccion.models import Recetas, RecetasDetalles, RelacionesRecetas
from apps.inventario.models import MateriasPrimas, ProductosElaborados, ProductosIntermedios, ProductosFinales, LotesProductosElaborados, LotesStatus, ComponentesStockManagement
from apps.produccion.serializers import RecetasSerializer, RecetasDetallesSerializer, RecetasSearchSerializer, ProduccionSerializer, ProduccionDetallesSerializer
from django.db.models import Q
from django.core.exceptions import ValidationError
from apps.produccion.services import ProductionValidationService, StockConsumptionService, ProductionService
from decimal import Decimal
from django.utils import timezone

class RecetasViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer

    def create(self, request, *args, **kwargs):
    # Step 1: Manual validation of frontend data
        data = request.data
        nombre = data.get('nombre')
        notas = data.get('notas', '')
        componentes = data.get('componente_receta', [])

        # Basic validation
        if not nombre:
            return Response({'error': 'El nombre es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        if not componentes or len(componentes) == 0:
            return Response({'error': 'Los componentes son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the main recipe using RecetasSerializer
        recipe_data = {
            'nombre': nombre,
            'notas': notas,
            'producto_elaborado': data.get('producto_elaborado', None)
        }

        recipe_serializer = self.get_serializer(data=recipe_data)
        if recipe_serializer.is_valid():
            receta = recipe_serializer.save()
        else:
            return Response(recipe_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create recipe components using RecetasDetallesSerializer
        recetas_created = []
        for componente in componentes:
            objecto_componente = {}
            if componente.get('materia_prima') == True:
                objecto_componente = {
                    'receta': receta.id,
                    'componente_materia_prima': componente['componente_id'],        
                    'componente_producto_intermedio': None,
                    'cantidad': componente.get('cantidad', 0)
                }

            elif componente.get('producto_intermedio') == True:
                objecto_componente = {
                    'receta': receta.id,
                    'componente_materia_prima': None,
                    'componente_producto_intermedio': componente['componente_id'],
                    'cantidad': componente.get('cantidad', 0)
                }

            # Use RecetasDetallesSerializer for components
            detail_serializer = RecetasDetallesSerializer(data=objecto_componente)
            if detail_serializer.is_valid():
                detail_serializer.save()
                recetas_created.append(detail_serializer.data)
            else:
                return Response(detail_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create recipe relationships
        receta_relacionada = data.get('receta_relacionada', [])
        if receta_relacionada:
            # Validate that all recipe IDs exist
            valid_recipe_ids = Recetas.objects.filter(
                id__in=receta_relacionada
            ).values_list('id', flat=True)

            if len(valid_recipe_ids) != len(receta_relacionada):
                return Response(
                    {'error': 'Some recipe IDs are invalid'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            relaciones = [
                RelacionesRecetas(
                    receta_principal=receta,
                    subreceta_id=receta_id
                )
                for receta_id in valid_recipe_ids
            ]
            RelacionesRecetas.objects.bulk_create(relaciones)

        # Return the created recipe with components
        return Response({
            'receta': recipe_serializer.data,
            'componentes': recetas_created,
            'relaciones_count': len(receta_relacionada)
        }, status=status.HTTP_201_CREATED)


    @action(detail=True, methods=['get'])
    def get_receta_detalles(self, request, *args, **kwargs):
        try:
            receta_id = kwargs.get('pk')
            receta_componentes = RecetasDetalles.objects.filter(receta=receta_id)
            receta_instance = Recetas.objects.get(id=receta_id)
            
            # Serialize the main recipe instance
            receta_serializer = self.get_serializer(receta_instance)

            lista_componentes = []
            for receta_componente in receta_componentes:
                if receta_componente.componente_materia_prima:
                    lista_componentes.append({
                        'id': receta_componente.componente_materia_prima.id,
                        'nombre': receta_componente.componente_materia_prima.nombre,
                        'tipo': 'Materia Prima',
                        'cantidad': receta_componente.cantidad ,
                        'unidad_medida': receta_componente.componente_materia_prima.unidad_medida_base.abreviatura
                        })
                elif receta_componente.componente_producto_intermedio:
                    lista_componentes.append({
                        'id': receta_componente.componente_producto_intermedio.id,
                        'nombre': receta_componente.componente_producto_intermedio.nombre_producto,
                        'tipo': 'Producto Intermedio',
                        'cantidad': receta_componente.cantidad,
                        'unidad_medida': receta_componente.componente_producto_intermedio.unidad_medida_nominal.abreviatura
                        })

            relaciones_recetas = RelacionesRecetas.objects.filter(receta_principal=receta_id)
            lista_relaciones_recetas = []
            for relacion in relaciones_recetas:
                lista_relaciones_recetas.append({
                    'id': relacion.subreceta.id,
                    'nombre': relacion.subreceta.nombre
                })

            return Response({
                'receta': receta_serializer.data,
                'componentes': lista_componentes,
                'relaciones_recetas': lista_relaciones_recetas
                    })
        except Recetas.DoesNotExist:
            return Response({'error': 'Receta not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=True, methods=['put'])
    def update_receta(self, request, *args, **kwargs):
        receta_id = kwargs.get('pk')
        
        try:
            with transaction.atomic():
                # Update the main recipe
                receta_instance = Recetas.objects.get(id=receta_id)
                serializer = self.get_serializer(receta_instance, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # --- Componentes Update Logic ---
                componentes_data = request.data.get('componente_receta', [])

                # 1. Fetch all existing components for this recipe in one query
                existing_details = RecetasDetalles.objects.filter(receta=receta_instance)
                
                # 2. Create maps for efficient lookup of existing components
                existing_mp_map = {det.componente_materia_prima_id: det for det in existing_details if det.componente_materia_prima_id}
                existing_pi_map = {det.componente_producto_intermedio_id: det for det in existing_details if det.componente_producto_intermedio_id}

                # 3. Process incoming components to determine what to create, update, or delete
                incoming_mp_ids = set()
                incoming_pi_ids = set()
                details_to_update = []
                details_to_create = []

                for comp_data in componentes_data:
                    cantidad = comp_data.get('cantidad', 0)
                    componente_id = comp_data.get('componente_id')

                    if comp_data.get('materia_prima'):
                        incoming_mp_ids.add(componente_id)
                        if componente_id in existing_mp_map:
                            # This component exists, check if quantity needs an update
                            detail = existing_mp_map[componente_id]
                            if detail.cantidad != cantidad:
                                detail.cantidad = cantidad
                                details_to_update.append(detail)
                        else:
                            # This is a new component to be created
                            details_to_create.append(RecetasDetalles(
                                receta=receta_instance,
                                componente_materia_prima_id=componente_id,
                                cantidad=cantidad
                            ))
                    
                    elif comp_data.get('producto_intermedio'):
                        incoming_pi_ids.add(componente_id)
                        if componente_id in existing_pi_map:
                            # This component exists, check if quantity needs an update
                            detail = existing_pi_map[componente_id]
                            if detail.cantidad != cantidad:
                                detail.cantidad = cantidad
                                details_to_update.append(detail)
                        else:
                            # This is a new component to be created
                            details_to_create.append(RecetasDetalles(
                                receta=receta_instance,
                                componente_producto_intermedio_id=componente_id,
                                cantidad=cantidad
                            ))

                # 4. Delete components that are no longer in the recipe
                mp_ids_to_delete = set(existing_mp_map.keys()) - incoming_mp_ids
                if mp_ids_to_delete:
                    RecetasDetalles.objects.filter(receta=receta_instance, componente_materia_prima_id__in=mp_ids_to_delete).delete()
                
                pi_ids_to_delete = set(existing_pi_map.keys()) - incoming_pi_ids
                if pi_ids_to_delete:
                    RecetasDetalles.objects.filter(receta=receta_instance, componente_producto_intermedio_id__in=pi_ids_to_delete).delete()

                # 5. Perform bulk updates and creates for maximum efficiency
                if details_to_update:
                    RecetasDetalles.objects.bulk_update(details_to_update, ['cantidad'])
                
                if details_to_create:
                    RecetasDetalles.objects.bulk_create(details_to_create)

                # --- End Componentes Update Logic ---

                # Receta Relacionada
                receta_relacionada_data = request.data.get('receta_relacionada', [])
                receta_relacionadas_registradas = RelacionesRecetas.objects.filter(receta_principal=receta_instance)

                current_related_ids = set(receta_relacionadas_registradas.values_list('subreceta_id', flat=True))
                new_related_ids = set(receta_relacionada_data)

                relationships_to_delete = receta_relacionadas_registradas.filter(
                    subreceta_id__in=current_related_ids - new_related_ids
                )
                relationships_to_delete.delete()

                # Create new relationships
                ids_to_create = new_related_ids - current_related_ids
                if ids_to_create:
                    new_relationships = [
                        RelacionesRecetas(
                            receta_principal=receta_instance,
                            subreceta_id=receta_id
                        )
                        for receta_id in ids_to_create
                    ]
                    RelacionesRecetas.objects.bulk_create(new_relationships)

                return Response(serializer.data, status=status.HTTP_200_OK)
                
        except Recetas.DoesNotExist:
            return Response({'error': 'Receta not found'}, status=status.HTTP_404_NOT_FOUND)
        except (MateriasPrimas.DoesNotExist, ProductosElaborados.DoesNotExist):
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecetasSearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSearchSerializer

    @action(detail=False, methods=['get'])
    def list_recetas(self, request):
        search_query = request.query_params.get('search')
        recetaId = request.query_params.get('recetaId', None)
        search_on_receta = request.query_params.get('searchOnReceta', None)

        if not search_query:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "El parámetro 'search' es requerido"})

        filters = Q(nombre__icontains=search_query)

        if not search_on_receta:
            filters &= Q(producto_elaborado__isnull=True)

        if recetaId:
            filters &= ~Q(id=recetaId)
        recetas = Recetas.objects.filter(filters)
        
        serializer = self.get_serializer(recetas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProduccionesViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer


    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        try:
            with transaction.atomic():
                # Expire old lots before processing
                ComponentesStockManagement.expirar_todos_lotes_viejos(True)
                producto = ProductionValidationService.validate_production_data(serializer.validated_data)
                # Extract validated data
                componentes = serializer.validated_data['componentes']

                # Separate components by type
                mp_componentes = [c for c in componentes if c['tipo'] == 'MateriaPrima']
                pi_componentes = [c for c in componentes if c['tipo'] == 'ProductoIntermedio']

                # Get component instances
                materias_primas_produccion = MateriasPrimas.objects.filter(
                    id__in=[c['id'] for c in mp_componentes]
                ).select_related('unidad_medida_base', 'categoria')

                productos_intermedios_produccion = ProductosIntermedios.objects.filter(
                    id__in=[c['id'] for c in pi_componentes]
                ).select_related('unidad_produccion', 'categoria')


                # Create quantity maps
                map_mp_cantidad = {c['id']: Decimal(str(c['cantidad']))for c in mp_componentes}
                map_pi_cantidad = {c['id']: Decimal(str(c['cantidad'])) for c in pi_componentes}

                ProductionValidationService.validate_component_availability(
                    materias_primas_produccion, 
                    productos_intermedios_produccion, 
                    map_mp_cantidad, 
                    map_pi_cantidad
                )

                # Create production record using service
                produccion = ProductionService.create_production_record(
                    producto=producto,
                    cantidad_produccion=serializer.validated_data['cantidadProduction'],
                    fecha_expiracion=serializer.validated_data['fechaExpiracion'],
                    user=User.objects.get(id=1), # TODO: Change this to the current user
                    unidad_medida=producto.unidad_produccion
                )

                costo_total = StockConsumptionService.consume_materials_and_intermediates(
                    materias_primas_produccion, 
                    productos_intermedios_produccion, 
                    map_mp_cantidad, 
                    map_pi_cantidad,
                    produccion
                )

                # Update total cost
                produccion.costo_total_componentes_usd = costo_total
                produccion.save(update_fields=['costo_total_componentes_usd'])

                # Create product lot using service
                lote = ProductionService.create_product_lot(
                    produccion=produccion,
                    producto=producto,
                    cantidad=serializer.validated_data['cantidadProduction'],
                    fecha_expiracion=serializer.validated_data['fechaExpiracion'],
                    costo_total=costo_total,
                    peso=serializer.validated_data.get('peso', None),
                    volumen=serializer.validated_data.get('volumen', None)
                )

                # update components stock
                product_id = serializer.validated_data['productoId']
                product_type = serializer.validated_data['tipoProducto']
                
                StockConsumptionService.update_components_stock(
                    product_id, product_type
                )

                return Response({
                    "message": "Producción registrada exitosamente",
                    "produccion_id": produccion.id,
                    "lote_id": lote.id,
                    "costo_total": costo_total
                }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProduccionDetallesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionDetallesSerializer
