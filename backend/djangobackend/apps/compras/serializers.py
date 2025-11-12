from rest_framework import serializers
from apps.compras.models import Proveedores
from apps.compras.models import OrdenesCompra, PagosProveedores, DetalleOrdenesCompra, Compras
from apps.core.serializers import EstadosOrdenCompraSerializer, MetodosDePagoSerializer


class ProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedores
        fields = [
                    'id', 
                    'nombre_proveedor', 
                    'apellido_proveedor', 
                    'nombre_comercial',   
                    'email_contacto', 
                    'telefono_contacto', 
                    'fecha_creacion_registro', 
                    'usuario_registro', 
                    'notas'
                ]


class CompraRegistroProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedores
        fields = [
                    'id', 
                    'nombre_proveedor'
                ]


class DetallesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleOrdenesCompra
        fields = [
            'id',
            'materia_prima',
            'producto_reventa',
            'cantidad_solicitada',
            'unidad_medida_compra',
            'costo_unitario_usd',
            'subtotal_linea_usd',
        ]


class DetallesResponseSerializer(serializers.ModelSerializer):
    materia_prima_nombre = serializers.CharField(source='materia_prima.nombre', read_only=True)
    producto_reventa_nombre = serializers.CharField(source='producto_reventa.nombre_producto', read_only=True)
    unidad_medida_abrev = serializers.CharField(source='unidad_medida_compra.abreviatura', read_only=True)

    class Meta:
        model = DetalleOrdenesCompra
        fields = [
            'id',
            'materia_prima',
            'materia_prima_nombre',
            'producto_reventa',
            'producto_reventa_nombre',
            'cantidad_solicitada',
            'cantidad_recibida',
            'cantidad_pendiente',
            'unidad_medida_compra',
            'unidad_medida_abrev',
            'costo_unitario_usd',
            'subtotal_linea_usd'
        ]

    def get_cantidad_pendiente(self, obj):
        return obj.cantidad_solicitada - obj.cantidad_recibida


class ComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compras
        fields = [
            'id',
            'orden_compra',
            'fecha_recepcion',
            'monto_pendiente_pago_usd',
            'tasa_cambio_aplicada',
            'pagado',
        ]


class FormattedResponseOCSerializer(serializers.ModelSerializer):
    proveedor = ProveedoresSerializer()
    estado_oc = EstadosOrdenCompraSerializer()
    metodo_pago = MetodosDePagoSerializer()
    detalles = DetallesResponseSerializer(many=True)
    recepciones = ComprasSerializer(many=True, read_only=True)

    class Meta:
        model = OrdenesCompra
        fields = [
            'id',
            'proveedor',
            'fecha_emision_oc',
            'fecha_entrega_esperada',
            'fecha_entrega_real',
            'estado_oc',
            'monto_total_oc_usd',
            'monto_total_oc_ves',
            'tasa_cambio_aplicada',
            'direccion_envio',
            'notas',
            'detalles',
            'terminos_pago',
            'metodo_pago',
            'recepciones',
        ]


class OrdenesCompraSerializer(serializers.ModelSerializer):
    detalles = DetallesSerializer(many=True)
    class Meta:
        model = OrdenesCompra
        fields = [
            'proveedor',
            'fecha_emision_oc',
            'fecha_entrega_esperada',
            'fecha_entrega_real',
            'estado_oc',
            'monto_total_oc_usd',
            'monto_total_oc_ves',   
            'tasa_cambio_aplicada',
            'direccion_envio',
            'notas',
            'detalles',
            'terminos_pago',
            'metodo_pago',
        ]


class OrdenesCompraTableSerializer(serializers.ModelSerializer):
    proveedor = serializers.CharField(source='proveedor.nombre_proveedor')
    estado_oc = serializers.CharField(source='estado_oc.nombre_estado')
    metodo_pago = serializers.CharField(source='metodo_pago.nombre_metodo')


    class Meta:
        model = OrdenesCompra
        fields = [
            'id',
            'proveedor',
            'fecha_emision_oc',
            'fecha_entrega_esperada',
            'fecha_entrega_real',
            'estado_oc',
            'metodo_pago',
            'monto_total_oc_usd',
        ]


## SERIALIZERS PARA LA RECEPCION DE COMPRA

class LoteRecepcionSerializer(serializers.Serializer):
    """Para recibir datos de lotes en la recepción"""
    id = serializers.IntegerField()
    cantidad = serializers.DecimalField(max_digits=10, decimal_places=2)
    fecha_caducidad = serializers.DateField()


class DetalleRecepcionSerializer(serializers.Serializer):
    detalle_oc_id = serializers.IntegerField()
    lotes = LoteRecepcionSerializer(many=True)
    cantidad_total_recibida = serializers.DecimalField(max_digits=10, decimal_places=2)


class RecepcionCompraSerializer(serializers.Serializer):
    orden_compra_id = serializers.IntegerField()
    detalles = DetalleRecepcionSerializer(many=True)
    recibido_parcialmente = serializers.BooleanField()


# serializers.py additions
class DetallesResponseSerializer(serializers.ModelSerializer):
    materia_prima_nombre = serializers.CharField(source='materia_prima.nombre', read_only=True)
    producto_reventa_nombre = serializers.CharField(source='producto_reventa.nombre_producto', read_only=True)
    unidad_medida_abrev = serializers.CharField(source='unidad_medida_compra.abreviatura', read_only=True)
    cantidad_pendiente = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = DetalleOrdenesCompra
        fields = [
            'id',
            'materia_prima',
            'materia_prima_nombre',
            'producto_reventa',
            'producto_reventa_nombre',
            'cantidad_solicitada',
            'cantidad_recibida',
            'cantidad_pendiente',
            'unidad_medida_compra',
            'unidad_medida_abrev',
            'costo_unitario_usd',
            'subtotal_linea_usd'
        ]
    

class RecepcionCompraSerializer(serializers.Serializer):
    orden_compra_id = serializers.IntegerField()
    fecha_recepcion = serializers.DateField()  # Add this field
    detalles = DetalleRecepcionSerializer(many=True)
    recibido_parcialmente = serializers.BooleanField()
    
    def validate(self, data):
        """Validate that received quantities don't exceed pending quantities"""
        try:
            orden_compra = OrdenesCompra.objects.get(id=data['orden_compra_id'])
        except OrdenesCompra.DoesNotExist:
            raise serializers.ValidationError("Orden de compra no encontrada")
        
        # Get all detalles at once to avoid N+1 queries
        detalles_oc_ids = [d['detalle_oc_id'] for d in data['detalles']]
        detalles_oc = DetalleOrdenesCompra.objects.filter(
            id__in=detalles_oc_ids
        ).select_related('materia_prima', 'producto_reventa')
        
        detalles_dict = {d.id: d for d in detalles_oc}
        
        for detalle_data in data['detalles']:
            oc_detalle = detalles_dict.get(detalle_data['detalle_oc_id'])
            if not oc_detalle:
                raise serializers.ValidationError(
                    f"Detalle de OC {detalle_data['detalle_oc_id']} no encontrado"
                )
            
            cantidad_pendiente = oc_detalle.cantidad_solicitada - oc_detalle.cantidad_recibida
            cantidad_recibida = detalle_data['cantidad_total_recibida']
            
            if cantidad_recibida > cantidad_pendiente:
                producto_nombre = (
                    oc_detalle.materia_prima.nombre if oc_detalle.materia_prima 
                    else oc_detalle.producto_reventa.nombre_producto
                )
                raise serializers.ValidationError(
                    f"La cantidad recibida de '{producto_nombre}' ({cantidad_recibida}) "
                    f"excede la cantidad pendiente ({cantidad_pendiente})"
                )
            
            # Validate that lotes sum equals cantidad_total_recibida
            suma_lotes = sum(lote['cantidad'] for lote in detalle_data['lotes'])
            if suma_lotes != cantidad_recibida:
                raise serializers.ValidationError(
                    f"La suma de lotes ({suma_lotes}) no coincide con "
                    f"la cantidad total recibida ({cantidad_recibida})"
                )
        
        return data


class PagosProveedoresSerializer(serializers.Serializer):
    """
    Serializer for registering payments to providers.
    Supports partial payments and tracks remaining balances.
    """
    compra_asociada = serializers.IntegerField(
        help_text="ID de la compra a la que se aplica el pago",
        required=False
    )
    orden_compra_asociada = serializers.IntegerField(
        help_text="ID de la orden de compra a la que se aplica el pago",
        required=False
    )
    metodo_pago = serializers.IntegerField(
        help_text="ID del método de pago utilizado"
    )
    monto_pago_usd = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto del pago en USD"
    )
    monto_pago_ves = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto del pago en VES"
    )
    tasa_cambio_aplicada = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Tasa de cambio USD/VES aplicada"
    )
    fecha_pago = serializers.DateField(
        help_text="Fecha en que se realizó el pago"
    )
    referencia_pago = serializers.CharField(
        max_length=100,
        help_text="Número de referencia bancaria"
    )
    notas = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Observaciones adicionales sobre el pago"
    )

    def validate_monto_pago_usd(self, value):
        """Ensure payment amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("El monto del pago debe ser mayor a cero")
        return value

    def validate(self, data):
        """Cross-field validation"""
        # Validate currency conversion
        expected_ves = data['monto_pago_usd'] * data['tasa_cambio_aplicada']
        tolerance = 0.01  # Allow 1 cent tolerance for rounding
        
        if abs(expected_ves - data['monto_pago_ves']) > tolerance:
            raise serializers.ValidationError(
                f"El monto en VES no coincide con la conversión. "
                f"Esperado: {expected_ves:.2f}, Recibido: {data['monto_pago_ves']}"
            )
        
        return data   