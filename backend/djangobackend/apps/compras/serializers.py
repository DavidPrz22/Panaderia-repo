from rest_framework import serializers
from apps.compras.models import Proveedores
from apps.compras.models import OrdenesCompra
from apps.compras.models import DetalleOrdenesCompra
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
            'porcentaje_impuesto',
            'impuesto_linea_usd',
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
            'unidad_medida_compra',
            'unidad_medida_abrev',
            'costo_unitario_usd',
            'subtotal_linea_usd',
            'porcentaje_impuesto',
            'impuesto_linea_usd',
        ]


class FormattedResponseOCSerializer(serializers.ModelSerializer):
    proveedor = ProveedoresSerializer()
    estado_oc = EstadosOrdenCompraSerializer()
    metodo_pago = MetodosDePagoSerializer()
    detalles = DetallesResponseSerializer(many=True)

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
            'subtotal_oc_usd',
            'subtotal_oc_ves',
            'monto_impuestos_oc_usd',
            'monto_impuestos_oc_ves',
            'tasa_cambio_aplicada',
            'direccion_envio',
            'notas',
            'detalles',
            'terminos_pago',
            'metodo_pago',
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
            'subtotal_oc_usd',
            'subtotal_oc_ves',
            'monto_impuestos_oc_usd',
            'monto_impuestos_oc_ves',
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