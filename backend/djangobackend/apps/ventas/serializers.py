from rest_framework import serializers
from .models import Clientes, OrdenVenta, DetallesOrdenVenta   
from apps.core.serializers import MetodosDePagoSerializer, EstadosOrdenVentaSerializer
from apps.inventario.serializers import ProductosElaboradosSerializer, ProductosReventaSerializer

class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = '__all__'


class ProductoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
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
                'tipo_producto': 'producto-final'
            }
        elif instance.producto_reventa:
            producto_data = {
                'id': instance.producto_reventa.id,
                'tipo_producto': 'producto-reventa'
            }
        else:
            producto_data = None

        return {
            'producto': producto_data,
            'cantidad_solicitada': instance.cantidad_solicitada,
            'unidad_medida': instance.unidad_medida.id if hasattr(instance.unidad_medida, 'id') else instance.unidad_medida,
            'precio_unitario_usd': instance.precio_unitario_usd,
            'subtotal_linea_usd': instance.subtotal_linea_usd,
            'descuento_porcentaje': instance.descuento_porcentaje,
            'impuesto_porcentaje': instance.impuesto_porcentaje,
        }


class VentaDetallesSerializer(serializers.Serializer):

    class Meta:
        model = DetallesOrdenVenta
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'nombre_producto': instance.producto_elaborado.nombre_producto if instance.producto_elaborado else instance.producto_reventa.nombre_producto,
            'cantidad_solicitada': instance.cantidad_solicitada,
            'unidad_medida': instance.unidad_medida.nombre_completo,
            'precio_unitario_usd': instance.precio_unitario_usd,
            'subtotal_linea_usd': instance.subtotal_linea_usd,
            'descuento_porcentaje': instance.descuento_porcentaje,
            'impuesto_porcentaje': instance.impuesto_porcentaje,
        }


class OrdenesSerializer(serializers.ModelSerializer):
    productos = ProductosOrdenesSerializer(many=True)
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
        ]

class OrdenesDetallesSerializer(serializers.ModelSerializer):
    cliente = ClientesSerializer()
    estado_orden = EstadosOrdenVentaSerializer()
    metodo_pago = MetodosDePagoSerializer()
    productos = serializers.SerializerMethodField()

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
        ]

    def get_productos(self, instance):
        productos = DetallesOrdenVenta.objects.filter(orden_venta_asociada=instance)
        return VentaDetallesSerializer(productos, many=True).data


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