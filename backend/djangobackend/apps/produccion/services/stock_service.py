from apps.produccion.models import DetalleProduccionCosumos, Produccion
from apps.inventario.models import LotesMateriasPrimas, LotesProductosElaborados


class StockConsumptionService:
    @staticmethod
    def consume_materials_and_intermediates(materias_primas, productos_intermedios, mp_map, pi_map, produccion: Produccion):
        """Handle stock consumption and return production details"""
        production_details = []
        total_cost = 0.00
        
        # Consume raw materials
        for mp in materias_primas:
            cantidad = mp_map[mp.id]
            consumed_data = mp.consumeStock(cantidad)
            
            # Get the actual lot object
            lote_mp = LotesMateriasPrimas.objects.get(id=consumed_data['lote_consumido'])
            
            production_details.append(DetalleProduccionCosumos(
                produccion=produccion,
                materia_prima_consumida=mp,
                cantidad_consumida=cantidad,
                unidad_medida=mp.unidad_medida_base,
                lote_materia_prima_consumida=lote_mp,
                costo_consumo_usd=consumed_data['costo_total_consumo']
            ))
            total_cost += consumed_data['costo_total_consumo']
        
        # Consume intermediate products
        for pi in productos_intermedios:
            cantidad = pi_map[pi.id]
            consumed_data = pi.consumeStock(cantidad)
            
            # Get the actual lot object
            lote_pi = LotesProductosElaborados.objects.get(id=consumed_data['lote_consumido'])
            
            production_details.append(DetalleProduccionCosumos(
                produccion=produccion,
                producto_intermedio_consumido=pi,
                cantidad_consumida=cantidad,
                unidad_medida=pi.unidad_produccion,
                lote_producto_intermedio_consumido=lote_pi,
                costo_consumo_usd=consumed_data['costo_total_consumo']
            ))
            total_cost += consumed_data['costo_total_consumo']
            
        return production_details, total_cost