from django.utils import timezone
from urllib import request
from django.forms import ValidationError
from rest_framework import viewsets
from apps.inventario.models import LotesProductosElaborados, LotesStatus, ProductosElaborados
from .models import Transformacion
from .serializers import TransformacionSerializer
from .models import EjecutarTransformacion
from .serializers import EjecutarTransformacionSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.core.services.services import NotificationService
import logging

logger = logging.getLogger(__name__)

class TransformacionViewSet(viewsets.ModelViewSet):
    queryset = Transformacion.objects.all()
    serializer_class = TransformacionSerializer

class EjecutarTransformacionViewSet(viewsets.ModelViewSet):
    queryset = EjecutarTransformacion.objects.all()
    serializer_class = EjecutarTransformacionSerializer

    def create(self, request, *args, **kwargs):
        print("Datos recibidos en ejecutar-transformacion:", request.data)
        try:
            with transaction.atomic():
                id_transformacion = request.data.get("transformacionId")
                id_producto_origen = request.data.get("productoOrigenId")
                id_producto_destino = request.data.get("productoDestinoId")
                print("ID transformacion:", id_transformacion)
                print("ID producto origen:", id_producto_origen)
                print("ID producto destino:", id_producto_destino)

                transformacion = Transformacion.objects.get(id=id_transformacion)
                producto_origen = ProductosElaborados.objects.get(id=id_producto_origen)
                producto_destino = ProductosElaborados.objects.get(id=id_producto_destino)

                # Lógica de lotes y stock
                lotes_producto_origen = LotesProductosElaborados.objects.filter(
                    producto_elaborado=producto_origen,
                    estado=LotesStatus.DISPONIBLE,
                    fecha_caducidad__gt=timezone.now().date()
                ).order_by('fecha_caducidad')
                lotes_producto_destino = LotesProductosElaborados.objects.filter(
                    producto_elaborado=producto_destino,
                    estado=LotesStatus.DISPONIBLE,
                    fecha_caducidad__gt=timezone.now().date()
                ).order_by('fecha_caducidad')

                if not lotes_producto_origen.exists():
                    print("No hay lotes disponibles para el producto de origen.")
                    return Response({"error": "No hay lotes disponibles para el producto de origen."}, status=status.HTTP_400_BAD_REQUEST)

                if not lotes_producto_destino.exists():
                    print("No hay lotes disponibles para el producto de destino, creando lote nuevo.")
                if lotes_producto_origen.exists():
                    produccion_origen = lotes_producto_origen.first().produccion_origen
                    fecha_caducidad = lotes_producto_origen.first().fecha_caducidad
                    LotesProductosElaborados.objects.create(
                    produccion_origen=produccion_origen,
                    producto_elaborado=producto_destino,
                    stock_actual_lote=0,
                    fecha_caducidad=fecha_caducidad
                )
                else:
                    return Response({"error": "No se puede crear lote destino sin lote de origen válido."}, status=status.HTTP_400_BAD_REQUEST)

                

                producto_origen.actualizar_stock(transformacion.cantidad_origen, tipo='resta')
                producto_destino.actualizar_stock(transformacion.cantidad_destino, tipo='suma')

                # Registrar la ejecución de la transformación
                ejecucion = EjecutarTransformacion.objects.create(
                    transformacion=transformacion,
                    producto_origen=producto_origen,
                    producto_destino=producto_destino
                )
                
                # Check for stock and expiration notifications after transformation
                try:
                    NotificationService.check_low_stock(ProductosElaborados)
                    NotificationService.check_sin_stock(ProductosElaborados)
                    NotificationService.check_expiration_date(ProductosElaborados, LotesProductosElaborados)
                except Exception as notif_error:
                    logger.error(f"Failed to create notifications: {str(notif_error)}")

                return Response({"message": "Transformación ejecutada y registrada correctamente."}, status=status.HTTP_200_OK)
        except ValidationError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)