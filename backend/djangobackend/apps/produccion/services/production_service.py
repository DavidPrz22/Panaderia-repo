from django.core.exceptions import ValidationError
from django.db import transaction
from apps.inventario.models import ProductosIntermedios, ProductosFinales, LotesProductosElaborados, LotesStatus
from apps.produccion.models import Produccion

class ProductionValidationService:
    @staticmethod
    def validate_production_data(serializer_data):
        """Validate production input data"""
        product_id = serializer_data['productoId']
        product_type = serializer_data['tipoProducto']
        cantidad = serializer_data['cantidadProduction']
        
        if cantidad <= 0:
            raise ValidationError("La cantidad de producción debe ser mayor a 0")
        
        # Get and validate product
        if product_type == 'ProductoIntermedio':
            producto = ProductosIntermedios.objects.filter(id=product_id).first()
        elif product_type == 'ProductoFinal':
            producto = ProductosFinales.objects.filter(id=product_id).first()
        else:
            raise ValidationError("Tipo de producto inválido")
            
        if not producto:
            raise ValidationError("Producto no encontrado")
            
        return producto

    @staticmethod
    def validate_component_availability(materias_primas, productos_intermedios, mp_map, pi_map):
        """Validate that all components have sufficient stock"""
        unavailable_items = []
        
        for mp in materias_primas:
            cantidad = mp_map[mp.id]
            if not mp.checkAvailability(cantidad):
                unavailable_items.append(f"Materia prima: {mp.nombre}")
        
        for pi in productos_intermedios:
            cantidad = pi_map[pi.id]
            if not pi.checkAvailability(cantidad):
                unavailable_items.append(f"Producto intermedio: {pi.nombre_producto}")
        
        if unavailable_items:
            raise ValidationError(f"Stock insuficiente para: {', '.join(unavailable_items)}")


class ProductionService:
    """Main service for handling production operations"""
    
    @staticmethod
    @transaction.atomic
    def create_production_record(producto, cantidad_produccion, fecha_expiracion, user, unidad_medida):
        """Create the main production record"""
        return Produccion.objects.create(
            producto_elaborado=producto,
            cantidad_producida=cantidad_produccion,
            fecha_expiracion=fecha_expiracion,
            usuario_creacion=user,
            costo_total_componentes_usd=0,
            unidad_medida=unidad_medida
        )
    
    @staticmethod
    def create_product_lot(produccion, producto, cantidad, fecha_expiracion, costo_total, peso=None, volumen=None):
        """Create product lot after production"""
        return LotesProductosElaborados.objects.create(
            produccion_origen=produccion,
            producto_elaborado=producto,
            cantidad_inicial_lote=cantidad,
            stock_actual_lote=cantidad,
            fecha_caducidad=fecha_expiracion,
            coste_total_lote_usd=costo_total,
            peso_total_lote_gramos=peso,
            volumen_total_lote_ml=volumen,
            estado=LotesStatus.DISPONIBLE
        )