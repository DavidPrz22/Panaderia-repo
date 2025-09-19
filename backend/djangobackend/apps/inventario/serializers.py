from rest_framework import serializers
from .models import MateriasPrimas, LotesMateriasPrimas, ProductosIntermedios, ProductosFinales, ProductosElaborados
from apps.core.models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados
from apps.compras.serializers import ProveedoresSerializer
from apps.compras.models import Proveedores
from apps.produccion.models import Recetas

class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadesDeMedida
        fields = ['id', 'nombre_completo', 'abreviatura', 'descripcion', 'tipo_medida']

class CategoriaMateriaPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasMateriaPrima
        fields = ['id', 'nombre_categoria', 'descripcion']

class MateriaPrimaSerializer(serializers.ModelSerializer):
    unidad_medida_base_detail = UnidadMedidaSerializer(source='unidad_medida_base', read_only=True)
    unidad_medida_empaque_estandar_detail = UnidadMedidaSerializer(source='unidad_medida_empaque_estandar', read_only=True)
    categoria_detail = CategoriaMateriaPrimaSerializer(source='categoria', read_only=True)

    class Meta:
        model = MateriasPrimas
        fields = [ 
                'id', 
                'nombre', 
                'unidad_medida_base', 
                'unidad_medida_base_detail',
                'unidad_medida_empaque_estandar', 
                'unidad_medida_empaque_estandar_detail',
                'stock_actual', 
                'SKU',
                'nombre_empaque_estandar',
                'cantidad_empaque_estandar',
                'unidad_medida_empaque_estandar',
                'unidad_medida_empaque_estandar_detail',
                'punto_reorden', 
                'categoria',
                'descripcion',
                'fecha_ultima_actualizacion',
                'fecha_creacion_registro',
                'fecha_modificacion_registro'
                ]


class ComponentesSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    tipo = serializers.CharField()
    stock = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    unidad_medida = serializers.CharField()


class LotesMateriaPrimaSerializer(serializers.ModelSerializer):
    fecha_recepcion = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "iso-8601"])
    fecha_caducidad = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "iso-8601"])
    proveedor = ProveedoresSerializer(read_only=True)
    proveedor_id = serializers.PrimaryKeyRelatedField(
        source='proveedor',
        queryset=Proveedores.objects.all(),
        write_only=True
    )

    class Meta:
        model = LotesMateriasPrimas
        fields = [
            'id',
            'materia_prima', 
            'proveedor',
            'proveedor_id',
            'fecha_recepcion',
            'fecha_caducidad', 
            'cantidad_recibida', 
            'stock_actual_lote', 
            'costo_unitario_usd', 
            'detalle_oc', 
            'estado',
        ]


class MateriaPrimaSerializer(serializers.ModelSerializer):

    # Nested serializers for detailed representation
    unidad_medida_base_detail = UnidadMedidaSerializer(source='unidad_medida_base', read_only=True)
    unidad_medida_empaque_estandar_detail = UnidadMedidaSerializer(source='unidad_medida_empaque_estandar', read_only=True)
    categoria_detail = CategoriaMateriaPrimaSerializer(source='categoria', read_only=True)

    # For write operations, we still use IDs
    unidad_medida_base = serializers.PrimaryKeyRelatedField(queryset=UnidadesDeMedida.objects.all(), write_only=True)
    unidad_medida_empaque_estandar = serializers.PrimaryKeyRelatedField(
        queryset=UnidadesDeMedida.objects.all(), 
        required=False, 
        allow_null=True,
        write_only=True
    )
    
    # Optional fields with proper null handling
    nombre_empaque_estandar = serializers.CharField(
        max_length=100,
        required=False,
        allow_null=True,
        allow_blank=True
    )
    cantidad_empaque_estandar = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        allow_null=True
    )
    descripcion = serializers.CharField(
        max_length=255,
        required=False,
        allow_null=True,
        allow_blank=True
    )
    
    categoria = serializers.PrimaryKeyRelatedField(queryset=CategoriasMateriaPrima.objects.all(), write_only=True)

    class Meta:
        model = MateriasPrimas
        fields = [
            'id',
            'nombre',
            'unidad_medida_base',
            'unidad_medida_base_detail',
            'stock_actual',
            'SKU',
            'nombre_empaque_estandar',
            'cantidad_empaque_estandar',
            'unidad_medida_empaque_estandar',
            'unidad_medida_empaque_estandar_detail',
            'punto_reorden',
            'fecha_ultima_actualizacion',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
            'categoria',
            'categoria_detail',
            'descripcion'
        ]
        read_only_fields = [
            'id',
            'fecha_ultima_actualizacion',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
            'stock_actual'
        ]

    def validate_nombre(self, value):
        """Validate that nombre doesn't contain special characters and is properly capitalized."""
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío o contener solo espacios.")
        return value.strip().title()

    def validate_SKU(self, value):
        """Validate SKU format."""
        if not value or not value.strip():
            raise serializers.ValidationError("El SKU es requerido.")
            
        value = value.strip().upper()
        if len(value) < 3:
            raise serializers.ValidationError("El SKU debe tener al menos 3 caracteres.")
        return value

    def validate_punto_reorden(self, value):
        """Validate that punto_reorden is positive."""
        if value < 0:
            raise serializers.ValidationError("El punto de reorden no puede ser negativo.")
        return value

    def validate_cantidad_empaque_estandar(self, value):
        """Validate that cantidad_empaque_estandar is positive if provided."""
        if value is None or value == 0 or value == "0" or value == "":
            return None

        if value < 0:
            raise serializers.ValidationError("La cantidad de empaque estándar debe ser mayor que 0.")
        return value
    
    def validate_unidad_medida_empaque_estandar(self, value):
        """Validate that unidad_medida_empaque_estandar is provided if required."""
        if value is None or value == 0 or value == "0" or value == "":
            return None
        return value

    def validate(self, data):
        """Validate related fields and business rules."""
        # Clean empty strings, zeros, and empty values to None for optional fields
        optional_fields = ['nombre_empaque_estandar', 'descripcion']
        numeric_fields = ['cantidad_empaque_estandar', 'unidad_medida_empaque_estandar']
        
        # Handle string fields
        for field in optional_fields:
            if field in data and isinstance(data[field], str) and not data[field].strip():
                data[field] = None
        
        # Handle numeric fields
        for field in numeric_fields:
            if field in data and (data[field] == 0 or data[field] == "0" or data[field] == ""):
                data[field] = None

        # Packaging fields validation
        packaging_fields = {
            'nombre_empaque_estandar': 'Nombre de empaque estándar',
            'cantidad_empaque_estandar': 'Cantidad de empaque estándar',
            'unidad_medida_empaque_estandar': 'Unidad de medida de empaque estándar'
        }
        
        # Check if any non-null packaging field is provided
        provided_fields = {k: v for k, v in data.items() if k in packaging_fields and v is not None}
        
        if provided_fields:
            # If any packaging field is provided with a non-null value, ensure all are provided
            missing_fields = [
                packaging_fields[field] 
                for field in packaging_fields 
                if field not in data or data.get(field) is None
            ]
            if missing_fields:
                raise serializers.ValidationError({
                    'packaging_error': (
                        f"Los siguientes campos de empaque son requeridos cuando se proporciona "
                        f"información de empaque: {', '.join(missing_fields)}"
                    )
                })

        return data

    def to_representation(self, instance):
        """Customize the output representation of the serializer."""
        data = super().to_representation(instance)
        
        # Remove write_only fields from output
        write_only_fields = ['unidad_medida_base', 'unidad_medida_empaque_estandar', 'categoria']
        for field in write_only_fields:
            data.pop(field, None)

        # Format dates for better readability
        date_fields = ['fecha_ultima_actualizacion', 'fecha_creacion_registro', 'fecha_modificacion_registro']
        for field in date_fields:
            if data.get(field):
                data[field] = instance.__getattribute__(field).strftime('%Y-%m-%d')

        return data
    

class ProductosIntermediosSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre_categoria', read_only=True)
    receta_relacionada = serializers.CharField(write_only=True, required=True)
    unidad_produccion_producto = serializers.CharField(source='unidad_produccion.nombre_completo', read_only=True)
    class Meta:
        model = ProductosIntermedios
        fields = [
            'id', 
            'nombre_producto', 
            'SKU', 
            'stock_actual', 
            'punto_reorden', 
            'categoria',
            'unidad_produccion',
            'unidad_produccion_producto',
            'descripcion',
            'tipo_medida_fisica',
            'categoria_nombre', 
            'fecha_creacion_registro',
            'receta_relacionada',
        ]
        extra_kwargs = {
            'categoria': {'write_only': True},
            'categoria_nombre': {'read_only': True},
        }

    def create(self, validated_data):
        receta_relacionada = validated_data.pop('receta_relacionada', None)

        validated_data['es_intermediario'] = True
        validated_data['precio_venta_usd'] = None
        validated_data['unidad_venta'] = None
        validated_data['vendible_por_medida_real'] = None

        producto_intermedio = ProductosIntermedios.objects.create(**validated_data)

        if receta_relacionada:
            try:
                receta = Recetas.objects.get(id=receta_relacionada)
                receta.producto_elaborado = producto_intermedio
                receta.save()
            except Recetas.DoesNotExist:
                pass
        return producto_intermedio

    def update(self, instance, validated_data):
        receta_relacionada = validated_data.pop('receta_relacionada', None)

        instance = super().update(instance, validated_data)
        
        if receta_relacionada:
            try:
                Recetas.objects.filter(producto_elaborado=instance).update(producto_elaborado=None)
                
                receta = Recetas.objects.get(id=receta_relacionada)
                receta.producto_elaborado = instance
                receta.save()
            except Recetas.DoesNotExist:
                pass
                
        return instance

class ProductosFinalesSerializer(serializers.ModelSerializer):
    # Read-only fields for displaying related object names
    categoria_nombre = serializers.CharField(source='categoria.nombre_categoria', read_only=True)
    unidad_venta_nombre = serializers.CharField(source='unidad_venta.nombre_completo', read_only=True)

    # Write-only fields for create/update operations
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=CategoriasProductosElaborados.objects.all(), write_only=True
    )
    unidad_venta = serializers.PrimaryKeyRelatedField(
        queryset=UnidadesDeMedida.objects.all(), write_only=True, required=False, allow_null=True
    )
    receta_relacionada = serializers.IntegerField(min_value=0, required=False, write_only=True)

    class Meta:
        model = ProductosFinales
        fields = [
            'id',
            'nombre_producto',
            'SKU',
            'precio_venta_usd',
            'stock_actual',
            'punto_reorden',
            'vendible_por_medida_real',
            # Read-only fields
            'categoria_nombre',
            'unidad_venta_nombre',
            # Write-only fields
            'categoria',
            'unidad_venta',
            'receta_relacionada',
            # Other fields needed for write
            'unidad_produccion',
            'tipo_medida_fisica',
            'descripcion',
        ]
        # Rename read-only fields in the output to match the frontend type
        extra_kwargs = {
            'categoria_nombre': {'source': 'categoria.nombre_categoria'},
            'unidad_venta_nombre': {'source': 'unidad_venta.nombre_completo'},
        }


    def to_representation(self, instance):
        """
        Customize the output to match the `ProductoFinal` type for list views.
        """
        representation = super().to_representation(instance)
        return {
            'id': representation.get('id'),
            'nombre_producto': representation.get('nombre_producto'),
            'SKU': representation.get('SKU'),
            'unidad_venta': representation.get('unidad_venta_nombre'),
            'precio_venta_usd': representation.get('precio_venta_usd'),
            'stock_actual': representation.get('stock_actual'),
            'punto_reorden': representation.get('punto_reorden'),
            'categoria': representation.get('categoria_nombre'),
        }


    def create(self, validated_data):

        receta_relacionada = validated_data.pop('receta_relacionada', None)
        validated_data['es_intermediario'] = False
        producto = ProductosFinales.objects.create(**validated_data)
        
        if receta_relacionada:
            try:
                receta = Recetas.objects.get(id=receta_relacionada)
                receta.producto_elaborado = producto
                receta.save()
            except Recetas.DoesNotExist:
                pass
        return producto

    def update(self, instance, validated_data):
        receta_relacionada = validated_data.pop('receta_relacionada', None)

        instance = super().update(instance, validated_data) 
        if receta_relacionada:
            try:
                Recetas.objects.filter(producto_elaborado=instance).update(producto_elaborado=None)
                
                receta = Recetas.objects.get(id=receta_relacionada)
                receta.producto_elaborado = instance
                receta.save()
            except Recetas.DoesNotExist:
                pass
        return instance


class ProductosFinalesDetallesSerializer(serializers.ModelSerializer):
    categoria_producto = serializers.SerializerMethodField()
    receta_relacionada = serializers.SerializerMethodField()
    unidad_produccion_producto = serializers.SerializerMethodField()
    unidad_venta_producto = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductosFinales
        fields = [
            'id',
            'nombre_producto',
            'SKU',
            'stock_actual',
            'punto_reorden',
            'categoria_producto',
            'unidad_produccion_producto',
            'unidad_venta_producto',
            'tipo_medida_fisica',
            'vendible_por_medida_real',
            'precio_venta_usd',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
            'descripcion',
            'receta_relacionada',
        ]

    def get_categoria_producto(self, obj):
        categoria = CategoriasProductosElaborados.objects.get(id=obj.categoria.id)
        return {
            'id': categoria.id,
            'nombre_categoria': categoria.nombre_categoria,
        }

    def get_unidad_produccion_producto(self, obj):
        unidad_produccion = UnidadesDeMedida.objects.get(id=obj.unidad_produccion.id)
        return {
            'id': unidad_produccion.id,
            'nombre_completo': unidad_produccion.nombre_completo,
        }

    def get_unidad_venta_producto(self, obj):
        if obj.unidad_venta:
            unidad_venta = UnidadesDeMedida.objects.get(id=obj.unidad_venta.id)
            return {
                'id': unidad_venta.id,
                'nombre_completo': unidad_venta.nombre_completo,
            }
        return None

    def get_receta_relacionada(self, obj):
        """Get the related recipe for a product."""
        try:
            receta_relacionada = Recetas.objects.get(producto_elaborado=obj.id)
            return {
                'id': receta_relacionada.id,
                'nombre': receta_relacionada.nombre,
            }
        except Recetas.DoesNotExist:
            return False

class ProductosFinalesListaTransformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductosFinales
        fields = ['id', 'nombre_producto']

class ProductosIntermediosDetallesSerializer(serializers.ModelSerializer):
    categoria_producto = serializers.SerializerMethodField()
    receta_relacionada = serializers.SerializerMethodField()
    unidad_produccion_producto = serializers.SerializerMethodField()
    class Meta:
        model = ProductosIntermedios
        fields = [
            'id',
            'nombre_producto',
            'SKU',
            'stock_actual',
            'punto_reorden',
            'categoria_producto',
            'unidad_produccion_producto',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
            'tipo_medida_fisica',
            'descripcion',
            'receta_relacionada',
        ]

    def get_categoria_producto(self, obj):
        categoria = CategoriasProductosElaborados.objects.get(id=obj.categoria.id)
        return {
            'id': categoria.id,
            'nombre_categoria': categoria.nombre_categoria,
        }

    def get_unidad_produccion_producto(self, obj):
        unidad_produccion = UnidadesDeMedida.objects.get(id=obj.unidad_produccion.id)
        return {
            'id': unidad_produccion.id,
            'nombre_completo': unidad_produccion.nombre_completo,
        }

    def get_receta_relacionada(self, obj):
        """Get the related recipe for a product."""

        try:
            receta_relacionada = Recetas.objects.get(producto_elaborado=obj.id)
            return {
            'id': receta_relacionada.id,
            'nombre': receta_relacionada.nombre,
        }
        except Recetas.DoesNotExist:
            return False


class ProductosElaboradosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductosElaborados
        fields = "__all__"


class ProductosFinalesSearchSerializer(serializers.ModelSerializer):
    unidad_medida = serializers.CharField(source='unidad_produccion.abreviatura', read_only=True)
    class Meta:
        model = ProductosFinales
        fields = ['id', 'nombre_producto', 'unidad_medida']


class ProductosIntermediosSearchSerializer(serializers.ModelSerializer):
    unidad_medida = serializers.CharField(source='unidad_produccion.abreviatura', read_only=True)
    class Meta:
        model = ProductosIntermedios
        fields = ['id', 'nombre_producto', 'unidad_medida']