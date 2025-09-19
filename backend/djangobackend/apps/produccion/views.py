from django.shortcuts import render
from apps.produccion.models import Produccion, DetalleProduccionCosumos
from apps.inventario.models import MateriasPrimas, LotesMateriasPrimas, ProductosElaborados, ProductosFinales, ProductosIntermedios, LotesProductosElaborados, LotesStatus
from rest_framework.response import Response
from rest_framework import viewsets, status
from apps.produccion.serializers import ProduccionSerializer
# Create your views here.


class ProduccionViewset(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Antes de crear la producción, verificar y expirar lotes viejos
        MateriasPrimas.expirar_todos_lotes_viejos()

        # Procesar la producción
        product_id = serializer.validated_data['productoId']
        product_type = serializer.validated_data['tipoProducto']

        if product_type == 'ProductoIntermedio':
            producto = ProductosIntermedios.objects.filter(id=product_id).first()
        elif product_type == 'ProductoFinal':
            producto = ProductosFinales.objects.filter(id=product_id).first()
        else:
            producto = None

        if not producto:
            return Response({"error": "Producto elaborado no encontrado."}, status=status.HTTP_400_BAD_REQUEST)
        

        cantidad_produccion = serializer.validated_data['cantidadProduction']

        # Obtener todos los componentes a utilizar

        componentes = serializer.validated_data['componentes']

        mp_componentes = [c for c in componentes if c['tipoComponente'] == 'MateriaPrima']
        pi_componentes = [c for c in componentes if c['tipoComponente'] == 'ProductoIntermedio']

        materias_primas_produccion = MateriasPrimas.objects.filter(id__in=[c['id'] for c in mp_componentes])
        productos_intermedios_produccion = ProductosIntermedios.objects.filter(id__in=[c['id'] for c in pi_componentes])

        # Registrar Cantidades a consumir
        map_mp_cantidad = {c['id']: c['cantidad'] for c in mp_componentes}
        map_pi_cantidad = {c['id']: c['cantidad'] for c in pi_componentes}

        # Verificar disponibilidad de stock
        for mp in materias_primas_produccion:
            cantidad = map_mp_cantidad[mp.id]
            available = mp.checkAvailability(cantidad)
            if not available:
                return Response({"error": f"No hay suficiente stock para la materia prima {mp.nombre}"}, status=status.HTTP_400_BAD_REQUEST)

        for pi in pi_componentes:
            cantidad = map_pi_cantidad[pi.id]
            available = pi.checkAvailability(cantidad)
            if not available:
                return Response({"error": f"No hay suficiente stock para el producto intermedio {pi.nombre_producto}"}, status=status.HTTP_400_BAD_REQUEST)

        # Calcular costo total de componentes
        costo_total = 0.00

        # Crear registro de producción
        produccion , created = Produccion.objects.get_or_create(
            producto_id=product_id,
            cantidad_produccion=cantidad_produccion,
            fecha_expiracion=serializer.validated_data['fechaExpiracion'],
            usuario_creacion=request.user,
            costo_total_componentes_usd=costo_total,
            unidad_medida=producto.unidad_medida_nominal
        )

        production_details = []
        # Consumir stock
        for mp in materias_primas_produccion:
            cantidad_consumir = map_mp_cantidad[mp.id]
            
            consumed_data = mp.consumeStock(cantidad_consumir)
            production_details.append({
                "produccion": produccion,
                "materia_prima_consumida": mp,
                "cantidad_consumida": cantidad_consumir,
                "unidad_medida": mp.unidad_medida_base,
                "lote_materia_prima_consumida": consumed_data['lote'],
                "costo_consumo_usd": consumed_data['costo_total_consumo']
                })
            costo_total += consumed_data['costo_total_consumo']

        for pi in productos_intermedios_produccion:
            cantidad_consumir = map_pi_cantidad[pi.id]

            consumed_data = pi.consumeStock(cantidad_consumir)
            production_details.append({
                "produccion": produccion,
                "producto_intermedio_consumido": pi,
                "cantidad_consumida": cantidad_consumir,
                "unidad_medida": pi.unidad_medida_nominal,
                "lote_producto_intermedio_consumido": consumed_data['lote'],
                "costo_consumo_usd": consumed_data['costo_total_consumo']
                })
            costo_total += consumed_data['costo_total_consumo']

        Produccion.objects.filter(id=produccion.id).update(costo_total_componentes_usd=costo_total)

        # Registrar Lotes de productos elaborados
        lote = LotesProductosElaborados.objects.create(
            produccion_origen=produccion,
            producto_elaborado_id=product_id,
            cantidad_inicial_lote=cantidad_produccion,
            stock_actual_lote=cantidad_produccion,
            fecha_caducidad=serializer.validated_data['fechaExpiracion'],
            coste_unitario_lote_usd=(costo_total / cantidad_produccion) if cantidad_produccion > 0 else 0,
            peso_nominal=serializer.validated_data.get('peso', None),
            estado=LotesStatus.DISPONIBLE
        )

        lote.save()

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)