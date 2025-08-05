from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Recetas, RecetasDetalles, MateriasPrimas
from apps.produccion.serializers import RecetasSerializer, RecetasDetallesSerializer

class RecetasDetallesViewSet(viewsets.ModelViewSet):
    queryset = RecetasDetalles.objects.all()
    serializer_class = RecetasDetallesSerializer


class RecetasViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer

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
        
        receta_detalle = RecetasDetalles.objects.create(nombre=nombre)

        recetas_created = []
        for componente in componentes:
            objecto_componente = {}
            if componente.get('materia_prima') == True:
                objecto_componente = {
                    'producto_elaborado': None,
                    'componente_materia_prima': componente['componente_id'],        
                    'componente_producto_intermedio': None,
                    'receta_detalle': receta_detalle.id,
                }
                
            elif componente.get('producto_intermedio') == True:
                objecto_componente = {
                    'producto_elaborado': None,
                    'componente_materia_prima': None,
                    'componente_producto_intermedio': componente['componente_id'],
                    'receta_detalle': receta_detalle.id,
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
        
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
