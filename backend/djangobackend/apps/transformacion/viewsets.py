from django.utils import timezone
from urllib import request
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import viewsets
from .models import Transformacion, EjecutarTransformacion
from .serializers import TransformacionSerializer, EjecutarTransformacionSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.core.services.services import NotificationService
from djangobackend.permissions import IsStaffLevelOnly
from .services import TransformationService
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class TransformacionViewSet(viewsets.ModelViewSet):
    queryset = Transformacion.objects.all()
    serializer_class = TransformacionSerializer
    permission_classes = [IsStaffLevelOnly]

class EjecutarTransformacionViewSet(viewsets.ModelViewSet):
    queryset = EjecutarTransformacion.objects.all()
    serializer_class = EjecutarTransformacionSerializer
    permission_classes = [IsStaffLevelOnly]

    def create(self, request, *args, **kwargs):
        print("Datos recibidos en ejecutar-transformacion:", request.data)
        try:
            id_transformacion = request.data.get("transformacion_id")
            id_producto_origen = request.data.get("producto_origen_id")
            id_producto_destino = request.data.get("producto_destino_id")
            
            if not id_transformacion:
                 return Response({"error": "Se requiere transformacion_id"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not id_producto_origen or not id_producto_destino:
                 return Response({"error": "Se requieren producto_origen_id y producto_destino_id"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Delegate to Service
            ejecucion = TransformationService.execute_transformation(
                transformacion_id=id_transformacion,
                producto_origen_id=id_producto_origen,
                producto_destino_id=id_producto_destino,
                user=request.user
            )
            
            # Helper logic: Check notifications (kept from original)
            try:
                from apps.inventario.models import ProductosElaborados, LotesProductosElaborados
                NotificationService.check_low_stock(ProductosElaborados)
                NotificationService.check_sin_stock(ProductosElaborados)
                NotificationService.check_expiration_date(ProductosElaborados, LotesProductosElaborados)
            except Exception as notif_error:
                logger.error(f"Failed to create notifications: {str(notif_error)}")

            serializer = self.get_serializer(ejecucion)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except DjangoValidationError as ve:
            return Response({"error": str(ve.message if hasattr(ve, 'message') else ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("Error ejecutando transformación")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)