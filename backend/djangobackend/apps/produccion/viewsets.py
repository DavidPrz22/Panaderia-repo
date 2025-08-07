from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Recetas, RecetasDetalles
from apps.produccion.serializers import RecetasSerializer, RecetasDetallesSerializer

class RecetasViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer

    @action(detail=True, methods=['get'])
    def get_receta_detalles(self, request, *args, **kwargs):
        receta_id = kwargs.get('pk')
        receta_componentes = RecetasDetalles.objects.filter(receta=receta_id)
        receta_instance = Recetas.objects.get(id=receta_id)
        
        # Serialize the main recipe instance
        receta_serializer = self.get_serializer(receta_instance)

        lista_componentes = []
        for receta_componente in receta_componentes:
            if receta_componente.componente_materia_prima:
                lista_componentes.append({
                    'id': receta_componente.id,
                    'nombre': receta_componente.componente_materia_prima.nombre,
                    'tipo': 'Materia Prima'
                    })
            elif receta_componente.componente_producto_intermedio:
                lista_componentes.append({
                    'id': receta_componente.id,
                    'nombre': receta_componente.componente_producto_intermedio.nombre,
                    'tipo': 'Producto Intermedio'
                    })

        return Response({
            'receta': receta_serializer.data,
            'componentes': lista_componentes
            })

class RecetasDetallesViewSet(viewsets.ModelViewSet):
    queryset = RecetasDetalles.objects.all()
    serializer_class = RecetasDetallesSerializer

    def create(self, request, *args, **kwargs):
    # Step 1: Manual validation of frontend data
        data = request.data
        nombre = data.get('nombre')
        componentes = data.get('componente_receta', [])
        # Basic validation
        if not nombre:
            return Response({'error': 'El nombre es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not componentes or len(componentes) == 0:
            return Response({'error': 'Los componentes son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        receta = Recetas.objects.create(nombre=nombre)

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

        

        # Step 2: Transform and create records
        # recetas_created = []
        
        # for componente in componentes:
        #     componente_id = componente.get('componente_id')
        #     is_materia_prima = componente.get('materia_prima', False)
            
        #     # Transform to Django model format
        #     receta_data = {
        #         'nombre': nombre,
        #         'componente_materia_prima': componente_id if is_materia_prima else None,
        #         'componente_producto_intermedio': componente_id if not is_materia_prima else None,
        #     }
            
        #     # Step 3: Use existing serializer for model validation
        #     serializer = self.get_serializer(data=receta_data)
        #     if serializer.is_valid():
        #         receta = serializer.save()
        #         recetas_created.append(serializer.data)
        #     else:
        #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

