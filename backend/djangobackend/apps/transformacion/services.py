from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import Min
from apps.inventario.models import (
    ProductosElaborados, 
    LotesProductosElaborados, 
    LotesStatus
)
from apps.produccion.models import Produccion
from .models import (
    Transformacion, 
    EjecutarTransformacion, 
    LotesConsumidosTransformacion
)

class TransformationService:
    @staticmethod
    @transaction.atomic
    def execute_transformation(transformacion_id, user, producto_origen_id, producto_destino_id):
        """
        Executes a transformation:
        1. Validates stock
        2. Consumes source lots (FIFO)
        3. Creates a new production/lot for destination
        4. Records traceability
        """
        try:
            transformacion = Transformacion.objects.get(id=transformacion_id)
            producto_origen = ProductosElaborados.objects.get(id=producto_origen_id)
            producto_destino = ProductosElaborados.objects.get(id=producto_destino_id)
        except (Transformacion.DoesNotExist, ProductosElaborados.DoesNotExist):
            raise ValidationError("La transformación o los productos especificados no existen.")

        cantidad_origen_req = transformacion.cantidad_origen
        
        if cantidad_origen_req <= 0:
             raise ValidationError("La cantidad a transformar debe ser mayor a 0.")

        if transformacion.cantidad_origen == 0:
            raise ValidationError("La cantidad origen definida en la transformación no puede ser 0.")
            
        cantidad_destino_real = transformacion.cantidad_destino 
        
        # 1. Check & Consume Stock (FIFO)
        # Using consumeStock for robust FIFO and lot management
        # consumeStock checks availability and raises ValidationError if insufficient
        consumo_result = producto_origen.consumeStock(cantidad_origen_req)
        
        # Unpack result
        # Structure: {'detalle_lotes_consumidos': [...], 'costo_consumo_lote': ...}
        consumed_lots_data = consumo_result.get('detalle_lotes_consumidos', [])
        costo_total_consumido = consumo_result.get('costo_consumo_lote', 0)
        
        if not consumed_lots_data:
             raise ValidationError("Error al consumir stock: no se detallaron lotes.")

        # Extract Lot IDs to fetch objects and determine expiration
        consumed_lot_ids = [item['lote_id'] for item in consumed_lots_data]
        
        # Fetch lot objects to access fecha_caducidad and for traceability
        # (Although consumeStock updates them, we need to read them for dates/FKs)
        # Note: consumeStock might have set some to AGOTADO, but they still exist.
        lotes_origen_objs = LotesProductosElaborados.objects.filter(id__in=consumed_lot_ids)
        lotes_map = {lote.id: lote for lote in lotes_origen_objs}
        
        # Determine expiration: earliest of consumed lots
        min_expiration_date = lotes_origen_objs.aggregate(min_date=Min('fecha_caducidad'))['min_date']
        
        if not min_expiration_date:
             raise ValidationError("No se pudo determinar la fecha de caducidad para el nuevo lote.")

        # 2. Create Production Record (Required for Lot)
        produccion = Produccion.objects.create(
            producto_elaborado=producto_destino,
            cantidad_producida=cantidad_destino_real,
            costo_total_componentes_usd=costo_total_consumido,
            usuario_creacion=user,
            unidad_medida=producto_destino.unidad_venta, 
            fecha_expiracion=min_expiration_date
        )
        
        # 3. Create New Lot (Destination)
        nuevo_lote = LotesProductosElaborados.objects.create(
            produccion_origen=produccion,
            producto_elaborado=producto_destino,
            cantidad_inicial_lote=cantidad_destino_real,
            stock_actual_lote=cantidad_destino_real,
            fecha_caducidad=min_expiration_date,
            estado=LotesStatus.DISPONIBLE,
            coste_total_lote_usd=costo_total_consumido,
            # For simplicity, assuming no weight/volume manual tracking here unless product requires it
            # If product is by weight, we should set peso_total_lote_gramos... 
            # ideally relying on logic that handles this if needed, but for now standard logic.
        )
        
        # Update destination product stock (Sync aggregate stock)
        producto_destino.actualizar_product_stock()
        
        # 4. Record Execution
        ejecucion = EjecutarTransformacion.objects.create(
            transformacion=transformacion,
            producto_origen=producto_origen,
            producto_destino=producto_destino,
        )
        
        # 5. Record Traceability (LotesConsumidosTransformacion)
        for detail in consumed_lots_data:
            lote_id = detail['lote_id']
            lote_origen = lotes_map.get(lote_id)
            if lote_origen:
                LotesConsumidosTransformacion.objects.create(
                    transformacion=transformacion,
                    lote_producto_elaborado_consumido=lote_origen,
                    lote_producto_elaborado_creado=nuevo_lote,
                    cantidad_consumida=detail['cantidad_consumida'],
                    cantidad_creada=cantidad_destino_real # associating the whole created batch
                )
            
        return ejecucion
