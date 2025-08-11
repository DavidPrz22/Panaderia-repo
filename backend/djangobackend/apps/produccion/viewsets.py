from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from apps.produccion.models import Recetas, RecetasDetalles
from apps.inventario.models import MateriasPrimas, ProductosElaborados
from apps.produccion.serializers import RecetasSerializer, RecetasDetallesSerializer, RecetasSearchSerializer

class RecetasViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer

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
                        'tipo': 'Materia Prima'
                        })
                elif receta_componente.componente_producto_intermedio:
                    lista_componentes.append({
                        'id': receta_componente.componente_producto_intermedio.id,
                        'nombre': receta_componente.componente_producto_intermedio.nombre,
                        'tipo': 'Producto Intermedio'
                        })

            return Response({
                'receta': receta_serializer.data,
                'componentes': lista_componentes
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
                    
                componentes = request.data.get('componente_receta', [])
                
                # Get existing components
                componentes_registrados_materia_prima = RecetasDetalles.objects.filter(
                    receta=receta_instance, 
                    componente_materia_prima__isnull=False
                )
                componentes_registrados_producto_intermedio = RecetasDetalles.objects.filter(
                    receta=receta_instance, 
                    componente_producto_intermedio__isnull=False
                )

                # Get new components from request
                componentes_update_materia_prima = [
                    MateriasPrimas.objects.get(id=componente.get('componente_id')) 
                    for componente in componentes 
                    if componente.get('materia_prima') == True
                ]
                
                componentes_update_producto_intermedio = [
                    ProductosElaborados.objects.get(id=componente.get('componente_id')) 
                    for componente in componentes 
                    if componente.get('producto_intermedio') == True
                ]

                # Delete components that are no longer in the update
                for componente in componentes_registrados_materia_prima:
                    if componente.componente_materia_prima not in componentes_update_materia_prima:
                        componente.delete()
                
                for componente in componentes_registrados_producto_intermedio:
                    if componente.componente_producto_intermedio not in componentes_update_producto_intermedio:
                        componente.delete()

                # Get existing component values for comparison
                existing_materia_prima_ids = set(
                    comp.componente_materia_prima.id for comp in componentes_registrados_materia_prima
                )
                existing_producto_intermedio_ids = set(
                    comp.componente_producto_intermedio.id for comp in componentes_registrados_producto_intermedio
                )

                # Create new components that don't exist yet
                for componente in componentes_update_materia_prima:
                    if componente.id not in existing_materia_prima_ids:
                        RecetasDetalles.objects.create(
                            receta=receta_instance, 
                            componente_materia_prima=componente
                        )

                for componente in componentes_update_producto_intermedio:
                    if componente.id not in existing_producto_intermedio_ids:
                        RecetasDetalles.objects.create(
                            receta=receta_instance, 
                            componente_producto_intermedio=componente
                        )

                return Response(serializer.data, status=status.HTTP_200_OK)
                
        except Recetas.DoesNotExist:
            return Response({'error': 'Receta not found'}, status=status.HTTP_404_NOT_FOUND)
        except (MateriasPrimas.DoesNotExist, ProductosElaborados.DoesNotExist):
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecetasSearchViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSearchSerializer

    @action(detail=False, methods=['get'])
    def list_recetas(self, request):
        search_query = request.query_params.get('search')
        if not search_query:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "El parámetro 'search' es requerido"})

        recetas = Recetas.objects.filter(nombre__icontains=search_query)
        serializer = self.get_serializer(recetas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecetasDetallesViewSet(viewsets.ModelViewSet):
    queryset = RecetasDetalles.objects.all()
    serializer_class = RecetasDetallesSerializer

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
        
        receta = Recetas.objects.create(nombre=nombre, notas=notas)

        recetas_created = []
        for componente in componentes:
            objecto_componente = {}
            if componente.get('materia_prima') == True:
                objecto_componente = {
                    'receta': receta.id,
                    'componente_materia_prima': componente['componente_id'],        
                    'componente_producto_intermedio': None,
                }
                
            elif componente.get('producto_intermedio') == True:
                objecto_componente = {
                    'receta': receta.id,
                    'componente_materia_prima': None,
                    'componente_producto_intermedio': componente['componente_id'],
                }
            serializer = self.get_serializer(data=objecto_componente)
            if serializer.is_valid():
                serializer.save()
                recetas_created.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(recetas_created, status=status.HTTP_201_CREATED)
