from apps.produccion.models import DetalleProduccionCosumos, Produccion, DetalleProduccionLote
from apps.inventario.models import ProductosIntermedios, ProductosFinales
from decimal import Decimal
class StockConsumptionService:
    @staticmethod
    def consume_materials_and_intermediates(materias_primas, productos_intermedios, mp_map, pi_map, produccion: Produccion):
        """Handle stock consumption and return production details"""
        production_details = []
        component_lot_data = []  # Store lot data with component reference
        total_cost = Decimal('0')
        
        # Process raw materials
        for mp in materias_primas:
            cantidad = mp_map[mp.id]
            consumed_data = mp.consumeStock(cantidad)
            
            # Create parent detail record
            detalle_produccion = DetalleProduccionCosumos(
                produccion=produccion,
                materia_prima_consumida=mp,
                cantidad_consumida=cantidad,
                costo_consumo_usd=consumed_data['costo_consumo_lote']
            )
            production_details.append(detalle_produccion)
            total_cost += consumed_data['costo_consumo_lote']
            
            # Store lot data with reference to parent (by index)
            component_lot_data.append({
                'parent_index': len(production_details) - 1,
                'lot_details': consumed_data['detalle_lotes_consumidos']
            })

        # Process intermediate products
        for pi in productos_intermedios:
            cantidad = pi_map[pi.id]
            consumed_data = pi.consumeStock(cantidad)
            
            # Create parent detail record
            detalle_produccion = DetalleProduccionCosumos(
                produccion=produccion,
                producto_intermedio_consumido=pi,
                cantidad_consumida=cantidad,
                costo_consumo_usd=consumed_data['costo_consumo_lote']
            )
            production_details.append(detalle_produccion)
            total_cost += consumed_data['costo_consumo_lote']
            
            # Store lot data with reference to parent (by index)
            component_lot_data.append({
                'parent_index': len(production_details) - 1,
                'lot_details': consumed_data['detalle_lotes_consumidos']
            })

        # Bulk create parent records
        created_details = DetalleProduccionCosumos.objects.bulk_create(production_details)
        
        # Create child lot records
        lot_records = []
        for component_data in component_lot_data:
            parent_detail = created_details[component_data['parent_index']]
            
            for lot_data in component_data['lot_details']:
                lot_record = DetalleProduccionLote(
                    detalle_produccion=parent_detail,
                    cantidad_consumida=lot_data['cantidad_consumida'],
                    costo_parcial_usd=lot_data['costo_parcial_usd']
                )
                
                # Set the appropriate lot FK based on component type
                if lot_data['es_materia_prima']:
                    lot_record.lote_materia_prima_id = lot_data['lote_id']
                else:
                    lot_record.lote_producto_intermedio_id = lot_data['lote_id']
                    
                lot_records.append(lot_record)
        
        # Bulk create lot records
        DetalleProduccionLote.objects.bulk_create(lot_records)
        
        return total_cost

    @staticmethod
    def update_components_stock(product_id, product_type):
        """Update components stock"""
        if product_type == 'producto-intermedio':
            producto = ProductosIntermedios.objects.filter(id=product_id).first()
        else:
            producto = ProductosFinales.objects.filter(id=product_id).first()

        producto.actualizar_product_stock()