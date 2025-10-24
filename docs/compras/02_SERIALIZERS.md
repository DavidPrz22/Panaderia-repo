# Serializers - Sistema de Órdenes de Compra

## 📋 Serializers Necesarios

### 1. OrdenCompraSerializer

```python
# backend/djangobackend/apps/compras/serializers.py

from rest_framework import serializers
from .models import OrdenesCompra, DetalleOrdenesCompra, Compras, DetalleCompras, PagosProveedores
from apps.core.models import EstadosOrdenCompra, MetodosDePago
from apps.inventario.models import MateriasPrimas, ProductosReventa

class DetalleOrdenCompraSerializer(serializers.ModelSerializer):
    materia_prima_nombre = serializers.CharField(source='materia_prima.nombre', read_only=True)
    producto_reventa_nombre = serializers.CharField(source='producto_reventa.nombre_producto', read_only=True)
    unidad_medida_abrev = serializers.CharField(source='unidad_medida_compra.abreviatura', read_only=True)
    
    class Meta:
        model = DetalleOrdenesCompra
        fields = [
            'id',
            'orden_compra',
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
            'notas'
        ]


class OrdenCompraListSerializer(serializers.ModelSerializer):
    """Para listado de órdenes de compra"""
    proveedor_nombre = serializers.CharField(source='proveedor.nombre_proveedor', read_only=True)
    estado_nombre = serializers.CharField(source='estado_oc.nombre_estado', read_only=True)
    
    class Meta:
        model = OrdenesCompra
        fields = [
            'id',
            'proveedor',
            'proveedor_nombre',
            'fecha_emision_oc',
            'fecha_entrega_esperada',
            'estado_oc',
            'estado_nombre',
            'monto_total_oc_usd',
            'email_enviado'
        ]


class OrdenCompraDetailSerializer(serializers.ModelSerializer):
    """Para detalle completo de una orden de compra"""
    proveedor = ProveedoresSerializer(read_only=True)
    estado_oc_detail = serializers.SerializerMethodField()
    metodo_pago_detail = serializers.SerializerMethodField()
    detalles = DetalleOrdenCompraSerializer(many=True, read_only=True, source='detalleordenescompra_set')
    usuario_creador_nombre = serializers.CharField(source='usuario_creador.get_full_name', read_only=True)
    
    class Meta:
        model = OrdenesCompra
        fields = '__all__'
    
    def get_estado_oc_detail(self, obj):
        return {
            'id': obj.estado_oc.id,
            'nombre': obj.estado_oc.nombre_estado
        }
    
    def get_metodo_pago_detail(self, obj):
        return {
            'id': obj.metodo_pago.id,
            'nombre': obj.metodo_pago.nombre_metodo
        }


class OrdenCompraCreateUpdateSerializer(serializers.ModelSerializer):
    """Para crear/actualizar órdenes de compra"""
    detalles = DetalleOrdenCompraSerializer(many=True, source='detalleordenescompra_set')
    
    class Meta:
        model = OrdenesCompra
        exclude = ['email_enviado', 'fecha_email_enviado']
    
    def create(self, validated_data):
        detalles_data = validated_data.pop('detalleordenescompra_set')
        orden = OrdenesCompra.objects.create(**validated_data)
        
        for detalle_data in detalles_data:
            DetalleOrdenesCompra.objects.create(orden_compra=orden, **detalle_data)
        
        return orden
    
    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('detalleordenescompra_set', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if detalles_data is not None:
            instance.detalleordenescompra_set.all().delete()
            for detalle_data in detalles_data:
                DetalleOrdenesCompra.objects.create(orden_compra=instance, **detalle_data)
        
        return instance
```

### 2. ComprasSerializer

```python
class LoteRecepcionSerializer(serializers.Serializer):
    """Para recibir datos de lotes en la recepción"""
    cantidad = serializers.DecimalField(max_digits=10, decimal_places=2)
    fecha_caducidad = serializers.DateField()
    costo_unitario_usd = serializers.DecimalField(max_digits=10, decimal_places=2)


class DetalleRecepcionSerializer(serializers.Serializer):
    """Para recibir datos de productos en la recepción"""
    detalle_oc_id = serializers.IntegerField()
    cantidad_recibida = serializers.DecimalField(max_digits=10, decimal_places=2)
    lotes = LoteRecepcionSerializer(many=True)


class CompraCreateSerializer(serializers.Serializer):
    """Serializer para crear una recepción de compra"""
    orden_compra_id = serializers.IntegerField()
    fecha_recepcion = serializers.DateField()
    numero_factura_proveedor = serializers.CharField(max_length=100, required=False, allow_blank=True)
    numero_remision = serializers.CharField(max_length=100, required=False, allow_blank=True)
    notas = serializers.CharField(required=False, allow_blank=True)
    detalles = DetalleRecepcionSerializer(many=True)
    
    def validate(self, data):
        # Validar que la OC existe y está en estado correcto
        try:
            oc = OrdenesCompra.objects.get(id=data['orden_compra_id'])
        except OrdenesCompra.DoesNotExist:
            raise serializers.ValidationError("Orden de compra no existe")
        
        if oc.estado_oc.nombre_estado not in ['Enviada', 'Recibida Parcial']:
            raise serializers.ValidationError(
                f"No se puede recepcionar una OC en estado '{oc.estado_oc.nombre_estado}'"
            )
        
        return data


class CompraDetailSerializer(serializers.ModelSerializer):
    """Para mostrar detalles de una compra/recepción"""
    orden_compra_numero = serializers.IntegerField(source='orden_compra.id', read_only=True)
    proveedor = ProveedoresSerializer(read_only=True)
    usuario_recepcionador_nombre = serializers.CharField(source='usuario_recepcionador.get_full_name', read_only=True)
    detalles = serializers.SerializerMethodField()
    
    class Meta:
        model = Compras
        fields = '__all__'
    
    def get_detalles(self, obj):
        from apps.compras.serializers import DetalleComprasSerializer
        return DetalleComprasSerializer(obj.detalles.all(), many=True).data


class DetalleComprasSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.SerializerMethodField()
    unidad_medida_abrev = serializers.CharField(source='unidad_medida.abreviatura', read_only=True)
    
    class Meta:
        model = DetalleCompras
        fields = '__all__'
    
    def get_producto_nombre(self, obj):
        if obj.materia_prima:
            return obj.materia_prima.nombre
        return obj.producto_reventa.nombre_producto
```

### 3. PagosProveedoresSerializer

```python
class PagoProveedorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagosProveedores
        exclude = ['created_at', 'updated_at']
    
    def validate(self, data):
        # Validar que el monto no exceda el pendiente
        if data.get('compra_asociada'):
            compra = data['compra_asociada']
            if data['monto_pago_usd'] > compra.monto_pendiente_pago_usd:
                raise serializers.ValidationError(
                    f"El monto de pago (${data['monto_pago_usd']}) excede el monto pendiente (${compra.monto_pendiente_pago_usd})"
                )
        
        return data


class PagoProveedorDetailSerializer(serializers.ModelSerializer):
    proveedor = ProveedoresSerializer(read_only=True)
    metodo_pago_nombre = serializers.CharField(source='metodo_pago.nombre_metodo', read_only=True)
    compra_numero = serializers.IntegerField(source='compra_asociada.id', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario_registrador.get_full_name', read_only=True)
    
    class Meta:
        model = PagosProveedores
        fields = '__all__'
```

---

## 👉 Continúa en `03_VIEWSETS.md`
