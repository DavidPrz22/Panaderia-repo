from rest_framework import serializers
from .models import MateriasPrimas, LotesMateriasPrimas, ProductosIntermedios, ProductosFinales, ProductosElaborados, LotesProductosElaborados, ProductosReventa, LotesProductosReventa
from apps.core.models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, CategoriasProductosReventa
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

    def validate(self, data):
        """Validate dates for lot registration."""
        fecha_recepcion = data.get('fecha_recepcion')
        fecha_caducidad = data.get('fecha_caducidad')

        # Import datetime here to avoid circular imports
        from datetime import date

        # Validate that fecha_recepcion is not in the future
        if fecha_recepcion and fecha_recepcion > date.today():
            raise serializers.ValidationError({
                'fecha_recepcion': 'La fecha de recepción no puede ser una fecha futura.'
            })

        # Validate that fecha_caducidad is after fecha_recepcion
        if fecha_recepcion and fecha_caducidad:
            if fecha_caducidad <= fecha_recepcion:
                raise serializers.ValidationError({
                    'fecha_caducidad': 'La fecha de caducidad debe ser posterior a la fecha de recepción.'
                })

            # Optional: Warn if dates are too close (less than 1 day apart)
            if (fecha_caducidad - fecha_recepcion).days < 1:
                raise serializers.ValidationError({
                    'fecha_caducidad': 'La fecha de caducidad debe ser al menos 1 día después de la fecha de recepción.'
                })

        return data


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
            'precio_compra_usd',
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
    receta_relacionada = serializers.IntegerField(required=False, write_only=True, allow_null=True)

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
            'usado_en_transformaciones',
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
            'usado_en_transformaciones',
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
            return None


class ProductosFinalesListaTransformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductosFinales
        fields = ['id', 'nombre_producto', 'stock_actual']


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
            return None


class LotesProductosElaboradosSerializer(serializers.ModelSerializer):
    fecha_produccion = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "iso-8601"])
    fecha_caducidad = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "iso-8601"])
    peso_promedio_por_unidad = serializers.SerializerMethodField()
    volumen_promedio_por_unidad = serializers.SerializerMethodField()
    costo_unitario_usd = serializers.SerializerMethodField()

    class Meta: 
        model = LotesProductosElaborados
        fields = [
            "id",
            "cantidad_inicial_lote",
            "stock_actual_lote",
            "fecha_produccion",
            "fecha_caducidad",
            "estado",
            "coste_total_lote_usd",
            "peso_total_lote_gramos",
            "volumen_total_lote_ml",
            "produccion_origen",
            "peso_promedio_por_unidad",
            "volumen_promedio_por_unidad",
            "costo_unitario_usd",
        ]

    def validate(self, data):
        """Validate dates for lot registration."""
        fecha_produccion = data.get('fecha_produccion')
        fecha_caducidad = data.get('fecha_caducidad')

        # Import datetime here to avoid circular imports
        from datetime import date

        # Validate that fecha_produccion is not in the future
        if fecha_produccion and fecha_produccion > date.today():
            raise serializers.ValidationError({
                'fecha_produccion': 'La fecha de producción no puede ser una fecha futura.'
            })

        # Validate that fecha_caducidad is after fecha_produccion
        if fecha_produccion and fecha_caducidad:
            if fecha_caducidad <= fecha_produccion:
                raise serializers.ValidationError({
                    'fecha_caducidad': 'La fecha de caducidad debe ser posterior a la fecha de producción.'
                })

            # Optional: Warn if dates are too close (less than 1 day apart)
            if (fecha_caducidad - fecha_produccion).days < 1:
                raise serializers.ValidationError({
                    'fecha_caducidad': 'La fecha de caducidad debe ser al menos 1 día después de la fecha de producción.'
                })

        return data

    def get_peso_promedio_por_unidad(self, obj):
        return obj.peso_promedio_por_unidad

    def get_volumen_promedio_por_unidad(self, obj):
        return obj.volumen_promedio_por_unidad

    def get_costo_unitario_usd(self, obj):
        return obj.costo_unitario_usd


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


class ProductosReventaSerializer(serializers.ModelSerializer):
    # Read-only fields for displaying related object names
    categoria_nombre = serializers.CharField(source='categoria.nombre_categoria', read_only=True)
    unidad_base_inventario_nombre = serializers.CharField(source='unidad_base_inventario.nombre_completo', read_only=True)
    unidad_venta_nombre = serializers.CharField(source='unidad_venta.nombre_completo', read_only=True)
    proveedor_preferido_nombre = serializers.CharField(source='proveedor_preferido.nombre_proveedor', read_only=True)

    # Write-only fields for create/update operations
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=CategoriasProductosReventa.objects.all(), write_only=True
    )
    unidad_base_inventario = serializers.PrimaryKeyRelatedField(
        queryset=UnidadesDeMedida.objects.all(), write_only=True
    )
    unidad_venta = serializers.PrimaryKeyRelatedField(
        queryset=UnidadesDeMedida.objects.all(), write_only=True
    )
    proveedor_preferido = serializers.PrimaryKeyRelatedField(
        queryset=Proveedores.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = ProductosReventa
        fields = [
            'id',
            'nombre_producto',
            'descripcion',
            'SKU',
            'categoria',
            'categoria_nombre',
            'marca',
            'proveedor_preferido',
            'proveedor_preferido_nombre',
            'unidad_base_inventario',
            'unidad_base_inventario_nombre',
            'unidad_venta',
            'unidad_venta_nombre',
            'factor_conversion',
            'precio_venta_usd',
            'punto_reorden',    
            'stock_actual',
            'precio_compra_usd',
            'perecedero',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
        ]
        read_only_fields = [
            'id',
            'stock_actual',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
        ]

    def create(self, validated_data):
        # Set default values for fields not provided in the form
        validated_data['stock_actual'] = 0

        return super().create(validated_data)

    def to_representation(self, instance):
        """Customize the output representation."""
        data = super().to_representation(instance)

        # Remove write_only fields from output
        write_only_fields = ['categoria', 'unidad_base_inventario', 'unidad_venta', 'proveedor_preferido']
        for field in write_only_fields:
            data.pop(field, None)

        # Handle optional proveedor_preferido
        if not instance.proveedor_preferido:
            data['proveedor_preferido_nombre'] = None

        return data


class LotesProductosReventaSerializer(serializers.ModelSerializer):
    fecha_recepcion = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "iso-8601"])
    fecha_caducidad = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d", "iso-8601"])
    proveedor = ProveedoresSerializer(read_only=True)
    proveedor_id = serializers.PrimaryKeyRelatedField(
        source='proveedor',
        queryset=Proveedores.objects.all(),
        write_only=True
    )

    class Meta:
        model = LotesProductosReventa
        fields = [
            'id',
            'producto_reventa',
            'fecha_recepcion',
            'fecha_caducidad',
            'cantidad_recibida',
            'stock_actual_lote',
            'coste_unitario_lote_usd',
            'detalle_oc',
            'proveedor',
            'proveedor_id',
            'estado',
        ]

    def validate(self, data):
        """Validate dates for lot registration."""
        fecha_recepcion = data.get('fecha_recepcion')
        fecha_caducidad = data.get('fecha_caducidad')

        # Import datetime here to avoid circular imports
        from datetime import date, timedelta

        # Validate that fecha_recepcion is not in the future
        if fecha_recepcion and fecha_recepcion > date.today():
            raise serializers.ValidationError({
                'fecha_recepcion': 'La fecha de recepción no puede ser una fecha futura.'
            })

        # Validate that fecha_caducidad is after fecha_recepcion
        if fecha_recepcion and fecha_caducidad:
            if fecha_caducidad <= fecha_recepcion:
                raise serializers.ValidationError({
                    'fecha_caducidad': 'La fecha de caducidad debe ser posterior a la fecha de recepción.'
                })

            # Optional: Warn if dates are too close (less than 1 day apart)
            if (fecha_caducidad - fecha_recepcion).days < 1:
                raise serializers.ValidationError({
                    'fecha_caducidad': 'La fecha de caducidad debe ser al menos 1 día después de la fecha de recepción.'
                })

        return data


class ProductosReventaDetallesSerializer(serializers.ModelSerializer):
    categoria = serializers.SerializerMethodField()
    proveedor_preferido = serializers.SerializerMethodField()
    unidad_base_inventario = serializers.SerializerMethodField()
    unidad_venta = serializers.SerializerMethodField()
    convert_inventory_to_sale_units = serializers.SerializerMethodField()
    convert_sale_to_inventory_units = serializers.SerializerMethodField()

    class Meta:
        model = ProductosReventa
        fields = [
            'id',
            'nombre_producto',
            'descripcion',
            'SKU',
            'categoria',
            'marca',
            'proveedor_preferido',
            'unidad_base_inventario',
            'unidad_venta',
            'factor_conversion',
            'stock_actual',
            'punto_reorden',
            'precio_venta_usd',
            'precio_compra_usd',
            'perecedero',
            'fecha_creacion_registro',
            'fecha_modificacion_registro',
            'convert_inventory_to_sale_units',
            'convert_sale_to_inventory_units',
        ]

    def get_categoria(self, obj):
        categoria = CategoriasProductosReventa.objects.get(id=obj.categoria.id)
        return {
            'id': categoria.id,
            'nombre_categoria': categoria.nombre_categoria,
        }

    def get_proveedor_preferido(self, obj):
        if obj.proveedor_preferido:
            proveedor = Proveedores.objects.get(id=obj.proveedor_preferido.id)
            return {
                'id': proveedor.id,
                'nombre_proveedor': proveedor.nombre_proveedor,
            }
        return None

    def get_unidad_base_inventario(self, obj):
        unidad = UnidadesDeMedida.objects.get(id=obj.unidad_base_inventario.id)
        return {
            'id': unidad.id,
            'nombre_completo': unidad.nombre_completo,
            'abreviatura': unidad.abreviatura,
        }

    def get_unidad_venta(self, obj):
        unidad = UnidadesDeMedida.objects.get(id=obj.unidad_venta.id)
        return {
            'id': unidad.id,
            'nombre_completo': unidad.nombre_completo,
            'abreviatura': unidad.abreviatura,
        }

    def get_convert_inventory_to_sale_units(self, obj):
        # Since it's a method that takes parameter, return the factor as example
        return f"Divide by {obj.factor_conversion}"

    def get_convert_sale_to_inventory_units(self, obj):
        # Since it's a method that takes parameter, return the factor as example
        return f"Multiply by {obj.factor_conversion}"


class CajaProductosSerializer(serializers.Serializer):
    def to_representation(self, instance):
        tipo_producto = 'reventa' if isinstance(instance, ProductosReventa) else 'final'
        
        return {
            'id': instance.id,
            'nombre': instance.nombre_producto,
            'categoria': instance.categoria.nombre_categoria if instance.categoria else None,
            'unidadVenta': instance.unidad_venta.abreviatura if instance.unidad_venta else None,
            'stock': instance.stock_actual,
            'sku': instance.SKU,
            'precio': instance.precio_venta_usd,
            'tipo': tipo_producto
        }

class RegisterCSVSerializer(serializers.Serializer):
    file = serializers.CharField(min_length=2)
