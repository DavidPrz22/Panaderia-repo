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
                # lotes_producto_origen = LotesProductosElaborados.objects.filter(
                #     producto_elaborado=producto_origen,
                #     estado=LotesStatus.DISPONIBLE,
                #     fecha_caducidad__gt=timezone.now().date()
                # ).order_by('fecha_caducidad')
                # lotes_producto_destino = LotesProductosElaborados.objects.filter(
                #     producto_elaborado=producto_destino,
                #     estado=LotesStatus.DISPONIBLE,
                #     fecha_caducidad__gt=timezone.now().date()
                # ).order_by('fecha_caducidad')

                # if not lotes_producto_origen.exists():
                #     print("No hay lotes disponibles para el producto de origen.")
                #     return Response({"error": "No hay lotes disponibles para el producto de origen."}, status=status.HTTP_400_BAD_REQUEST)

                # if not lotes_producto_destino.exists():
                #     print("No hay lotes disponibles para el producto de destino, creando lote nuevo.")
                #     lotes_producto_destino = LotesProductosElaborados.objects.create(
                #         producto_elaborado=producto_destino,
                #         stock_actual_lote=0,
                #         fecha_caducidad=lotes_producto_origen.first().fecha_caducidad
                #     )

                producto_origen.stock_actual -= transformacion.cantidad_origen
                producto_destino.stock_actual += transformacion.cantidad_destino

                producto_origen.actualizar_stock(transformacion.cantidad_origen, tipo='resta')
                producto_destino.actualizar_stock(transformacion.cantidad_destino, tipo='suma')


                # Registrar la ejecución de la transformación
                ejecucion = EjecutarTransformacion.objects.create(
                    transformacion=transformacion,
                    producto_origen=producto_origen,
                    producto_destino=producto_destino
                )
                print("Ejecución registrada:", ejecucion)

                print("Transformación ejecutada correctamente.")
                return Response({"message": "Transformación ejecutada y registrada correctamente."}, status=status.HTTP_200_OK)
        except ValidationError as ve:
            print("ValidationError en ejecutar-transformacion:", str(ve))
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error en ejecutar-transformacion:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)