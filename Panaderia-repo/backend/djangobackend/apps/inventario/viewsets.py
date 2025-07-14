from rest_framework import viewsets, status
from apps.inventario.models import MateriasPrimas, LotesMateriasPrimas
from apps.inventario.serializers import MateriaPrimaSerializer, LotesMateriaPrimaSerializer
from django.db.models import Min, Sum
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime

class MateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = MateriasPrimas.objects.all()
    serializer_class = MateriaPrimaSerializer


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