from rest_framework import serializers
from .models import Clientes, OrdenVenta, DetallesOrdenVenta, Pagos   
from apps.core.serializers import MetodosDePagoSerializer, EstadosOrdenVentaSerializer
from apps.inventario.serializers import ProductosElaboradosSerializer, ProductosReventaSerializer

class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = '__all__'


class ProductoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre_producto = serializers.CharField(required=False)
    stock = serializers.IntegerField(required=False)
    tipo_producto = serializers.CharField()


class ProductosOrdenesSerializer(serializers.Serializer):
    producto = ProductoSerializer()
    cantidad_solicitada = serializers.DecimalField(max_digits=10, decimal_places=3)
    unidad_medida = serializers.IntegerField()
    precio_unitario_usd = serializers.DecimalField(max_digits=10, decimal_places=3)
    subtotal_linea_usd = serializers.DecimalField(max_digits=10, decimal_places=3)
    descuento_porcentaje = serializers.DecimalField(max_digits=10, decimal_places=3)
    impuesto_porcentaje = serializers.DecimalField(max_digits=10, decimal_places=3)

    def to_representation(self, instance):
        """
        Convert DetallesOrdenVenta instance to the expected format.
        Handles the producto field which doesn't exist directly on the model.
        """
        # Extract producto from either producto_elaborado or producto_reventa
        if instance.producto_elaborado:
            producto_data = {
                'id': instance.producto_elaborado.id,
                'stock': instance.producto_elaborado.stock_actual,
                'nombre_producto': instance.producto_elaborado.nombre_producto,
                'tipo_producto': 'producto-final'
            }
        elif instance.producto_reventa:
            producto_data = {
                'id': instance.producto_reventa.id,
                'stock': instance.producto_reventa.stock_actual,
                'nombre_producto': instance.producto_reventa.nombre_producto,
                'tipo_producto': 'producto-reventa'
            }
        else:
            producto_data = None

        # Get unidad_medida data with full name
        unidad_medida_data = {
            'id': instance.unidad_medida.id,
            'abreviatura': instance.unidad_medida.abreviatura,
            'nombre_completo': instance.unidad_medida.nombre_completo
        } if instance.unidad_medida else None

        return {
            'producto': producto_data,
            'cantidad_solicitada': instance.cantidad_solicitada,
            'unidad_medida': unidad_medida_data,
            'precio_unitario_usd': instance.precio_unitario_usd,
            'subtotal_linea_usd': instance.subtotal_linea_usd,
            'descuento_porcentaje': instance.descuento_porcentaje,
            'impuesto_porcentaje': instance.impuesto_porcentaje,
        }


class OrdenesSerializer(serializers.ModelSerializer):
    productos = ProductosOrdenesSerializer(many=True)
    referencia_pago = serializers.CharField(
        required=False,
        allow_blank=True
    )

    class Meta:
        model = OrdenVenta
        fields = [
            'cliente', 
            'fecha_creacion_orden', 
            'fecha_entrega_solicitada', 
            'fecha_entrega_definitiva', 
            'estado_orden', 
            'notas_generales',
            'metodo_pago', 
            'monto_total_usd', 
            'monto_total_ves', 
            'tasa_cambio_aplicada',
            'monto_descuento_usd', 
            'monto_impuestos_usd',
            'productos',
            'referencia_pago',
        ]

        

class OrdenesDetallesSerializer(serializers.ModelSerializer):
    cliente = ClientesSerializer()
    estado_orden = EstadosOrdenVentaSerializer()
    metodo_pago = MetodosDePagoSerializer()
    productos = ProductosOrdenesSerializer(many=True)
    referencia_pago = serializers.SerializerMethodField()

    class Meta:
        model = OrdenVenta
        fields = [
            'id',
            'cliente', 
            'fecha_creacion_orden', 
            'fecha_entrega_solicitada', 
            'fecha_entrega_definitiva', 
            'estado_orden', 
            'notas_generales',
            'metodo_pago', 
            'monto_total_usd', 
            'monto_total_ves', 
            'tasa_cambio_aplicada',
            'monto_descuento_usd', 
            'monto_impuestos_usd',
            'productos',
            'referencia_pago',
        ]
        extra_kwargs = {
            'referencia_pago': {'read_only': True},
        }

    def get_referencia_pago(self, instance):
        return Pagos.objects.filter(orden_venta_asociada=instance).values_list('referencia_pago', flat=True).first()


class OrdenesTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenVenta
        fields = [
            'id',
            'cliente',
            'fecha_creacion_orden',
            'fecha_entrega_solicitada',
            'fecha_entrega_definitiva',
            'estado_orden',
            'metodo_pago',
            'total',
            'pago',
        ]

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'cliente': instance.cliente.nombre_cliente,
            'fecha_creacion_orden': instance.fecha_creacion_orden,
            'fecha_entrega_solicitada': instance.fecha_entrega_solicitada,
            'fecha_entrega_definitiva': instance.fecha_entrega_definitiva,
            'estado_orden': instance.estado_orden.nombre_estado,
            'metodo_pago': instance.metodo_pago.nombre_metodo,
            'total': instance.monto_total_usd,
        }