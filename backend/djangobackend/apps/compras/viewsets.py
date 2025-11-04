from rest_framework import viewsets
from apps.compras.models import Proveedores
from apps.compras.models import OrdenesCompra
from apps.compras.serializers import ProveedoresSerializer, CompraRegistroProveedoresSerializer, OrdenesCompraSerializer, OrdenesCompraTableSerializer, FormattedResponseOCSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from apps.compras.models import DetalleOrdenesCompra
from rest_framework import status, serializers


class ProveedoresViewSet(viewsets.ModelViewSet):
    queryset = Proveedores.objects.all()
    serializer_class = ProveedoresSerializer

    @action(detail=False, methods=['get'])
    def compra_registro(self, request):
        queryset = Proveedores.objects.all()
        serializer = CompraRegistroProveedoresSerializer(queryset, many=True)
        return Response(serializer.data)


class OrdenesCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenesCompra.objects.all()
    serializer_class = OrdenesCompraSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)  # Call is_valid FIRST
            
            # NOW we can access validated_data
            detalles_data = serializer.validated_data.pop('detalles')
            
            # Save the orden and get the instance
            orden = OrdenesCompra.objects.create(**serializer.validated_data, usuario_creador=request.user) # or override perform_create to return the instance
            
            # Create detalles
            bulk_create_detalles = []
            # Change this part in your viewset:
            for detalle_data in detalles_data:
                materia_prima_obj = detalle_data.pop('materia_prima', None)
                producto_reventa_obj = detalle_data.pop('producto_reventa', None)
                unidad_medida_compra_obj = detalle_data.pop('unidad_medida_compra', None)
                
                if materia_prima_obj:
                    bulk_create_detalles.append(DetalleOrdenesCompra(
                        orden_compra=orden,
                        materia_prima=materia_prima_obj,  # Pass the object directly
                        unidad_medida_compra=unidad_medida_compra_obj,  # Pass the object directly
                        **detalle_data
                    ))
                elif producto_reventa_obj:
                    bulk_create_detalles.append(DetalleOrdenesCompra(
                        orden_compra=orden,
                        producto_reventa=producto_reventa_obj,  # Pass the object directly
                        unidad_medida_compra=unidad_medida_compra_obj,  # Pass the object directly
                        **detalle_data
                    ))
                else:
                    raise serializers.ValidationError("Debe seleccionar al menos un producto")
            DetalleOrdenesCompra.objects.bulk_create(bulk_create_detalles)
            
            # Return response
            orden_serializer = FormattedResponseOCSerializer(orden)
            return Response({
                "orden": orden_serializer.data, 
            }, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['get'])
    def get_ordenes_table(self, request):
        queryset = OrdenesCompra.objects.all()
        serializer = OrdenesCompraTableSerializer(queryset, many=True)
        return Response(serializer.data)

