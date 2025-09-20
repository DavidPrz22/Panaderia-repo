# Recipe Schema Recommendations

## Current Issue Analysis
Your `Recetas` model allows `producto_elaborado` to be null. After discussion, this actually provides important workflow flexibility:
- ✅ Users can create recipes as drafts before linking to products
- ✅ Users can unlink and relink recipes to different products
- ❌ However, there's no uniqueness constraint (one product could have multiple active recipes)
- ❌ Missing quantity specifications in recipe details

## Recommended Changes

### 1. Keep Flexibility but Add Uniqueness Constraint

```python
class Recetas(models.Model):
    nombre = models.CharField(max_length=255, null=False, blank=False)
    # KEEP: Allow null for workflow flexibility, but ensure uniqueness when linked
    producto_elaborado = models.ForeignKey(
        ProductosElaborados, 
        on_delete=models.CASCADE, 
        related_name='recetas_como_producto_final',
        null=True,   # KEEP: Allows draft recipes
        blank=True,  # KEEP: Allows unlinking/relinking
        unique=True  # ADD: Ensures only one active recipe per product
    )
    rendimiento_receta = models.DecimalField(
        max_digits=10, 
        decimal_places=3, 
        null=False, 
        blank=False,
        help_text="Cantidad que produce esta receta (ej: 1 torta, 12 porciones, 2 kg de masa)"
    )
    unidad_medida_rendimiento = models.ForeignKey(
        UnidadesDeMedida,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        help_text="Unidad del rendimiento (ej: unidad, kg, litros)"
    )
    tiempo_preparacion_minutos = models.IntegerField(null=True, blank=True)
    temperatura_horno = models.IntegerField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    activa = models.BooleanField(default=True)
    notas = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        if self.producto_elaborado:
            return f"Receta: {self.producto_elaborado.nombre_producto}"
        else:
            return f"Receta (borrador): {self.nombre}"
```

### 2. Improve Recipe Details with Quantities

```python
class RecetasDetalles(models.Model):
    receta = models.ForeignKey(
        Recetas, 
        on_delete=models.CASCADE, 
        related_name='componentes'
    )
    
    # Component specification (one or the other, not both)
    componente_materia_prima = models.ForeignKey(
        MateriasPrimas, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    componente_producto_intermedio = models.ForeignKey(
        ProductosElaborados, 
        on_delete=models.CASCADE, 
        related_name='usado_en_recetas', 
        null=True, 
        blank=True
    )
    
    # CRITICAL ADDITION: Specify quantities
    cantidad_necesaria = models.DecimalField(
        max_digits=10, 
        decimal_places=3, 
        null=False, 
        blank=False
    )
    unidad_medida = models.ForeignKey(
        UnidadesDeMedida,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    # Optional fields for recipe steps
    orden_en_receta = models.IntegerField(default=1)
    instrucciones = models.TextField(max_length=500, null=True, blank=True)
    
    class Meta:
        constraints = [
            # Ensure exactly one component type
            models.CheckConstraint(
                check=(
                    Q(componente_materia_prima__isnull=False) & 
                    Q(componente_producto_intermedio__isnull=True)
                ) | (
                    Q(componente_materia_prima__isnull=True) & 
                    Q(componente_producto_intermedio__isnull=False)
                ),
                name="receta_detalle_un_solo_tipo_componente"
            )
        ]
        ordering = ['orden_en_receta']
```

## Business Logic Implications

### 1. Recipe Versioning (Future Enhancement)
Consider adding recipe versioning for when recipes change:
```python
class RecetaVersiones(models.Model):
    receta = models.ForeignKey(Recetas, on_delete=models.CASCADE)
    version = models.IntegerField()
    fecha_version = models.DateTimeField(auto_now_add=True)
    cambios_realizados = models.TextField()
    # Copy of recipe details at this version
```

### 2. Recipe Scaling
Your production system should be able to scale recipes:
- If recipe yields 1 cake, and you want to produce 5 cakes
- All ingredient quantities should scale by factor of 5

### 3. Cost Calculation
With proper quantities in recipes, you can calculate:
- Total cost of raw materials per recipe
- Cost per unit of finished product
- Profit margins

## Data Flow with Improved Schema

### Flexible Recipe Workflow:
1. **Draft Recipe Creation**: Create `Recetas` with `producto_elaborado=null` (draft state)
2. **Recipe Development**: Add `RecetasDetalles` with specific quantities
3. **Recipe Testing**: Test and refine recipe while in draft state
4. **Product Linking**: Link recipe to `ProductosElaborados` when ready
5. **Production**: Use linked recipe to determine material consumption
6. **Recipe Management**: Unlink/relink recipes as needed for product changes

### Alternative Workflow:
1. **Product-First**: Create `ProductosElaborados` first
2. **Direct Recipe**: Create `Recetas` directly linked to product
3. **Recipe Details**: Add components and quantities
4. **Production**: Immediate use in production

## Migration Strategy

1. **Data Audit**: Identify current recipes and their product associations
2. **Add Uniqueness Constraint**: Ensure no product has multiple active recipes
3. **Add Quantity Fields**: Update existing recipe details with quantities
4. **Business Logic**: Implement validation to prevent production without linked recipes
5. **UI Enhancements**: Support draft recipe workflow in admin/frontend

## Business Rules with Flexible Schema

### Draft Recipe Management:
- ✅ Users can create and test recipes without immediate product assignment
- ✅ Recipes can be unlinked and reassigned to different products
- ✅ Only one active recipe per product (enforced by unique constraint)
- ❌ Production is blocked if product has no linked recipe

### Production Validation:
```python
def validate_production_recipe(producto_elaborado):
    if not hasattr(producto_elaborado, 'recetas_como_producto_final') or \
       not producto_elaborado.recetas_como_producto_final.filter(activa=True).exists():
        raise ValidationError(f"Product {producto_elaborado.nombre_producto} has no active recipe")
```

This approach ensures:
- ✅ Flexible recipe development workflow
- ✅ Each product has at most one active recipe (uniqueness)
- ✅ Recipes can be drafted, tested, and refined before linking
- ✅ Recipes can be reassigned between products
- ✅ Production safety through recipe validation
- ✅ Accurate cost and inventory calculations when recipes are linked


# Analysis of Current Implementation

## ❌ Issues with Current Approach

### 1. **Circular Dependency Problem**
```python
# This creates a circular reference that won't work:
class Recetas(models.Model):
    subrecetas = models.ForeignKey(SubRecetas, ...)  # References SubRecetas

class SubRecetas(models.Model):
    receta = models.ForeignKey(Recetas, ...)  # References Recetas
```
**Problem**: `Recetas` references `SubRecetas` before `SubRecetas` is defined. Django can't resolve this.

### 2. **Conceptual Issues**
- `subrecetas` field in `Recetas` points to a single `SubRecetas` record, but you want multiple sub-recipes
- The relationship structure doesn't support the "recipe as baseline for multiple other recipes" use case
- Missing quantities - how much of each sub-recipe is needed?

### 3. **Syntax Errors**
```python
nombre = models.CharField(max_length=255, null=True, blank=True),  # Extra comma
producto_elaborado = models.ForeignKey(...),  # Extra comma
```

## ✅ Simplified and Correct Implementation

Based on your clarifications, here's the right approach:

```python
class Recetas(models.Model):
    """
    Simple recipe documentation - just groups components for each product
    """
    nombre = models.CharField(max_length=255, null=False, blank=False)
    producto_elaborado = models.ForeignKey(
        ProductosElaborados, 
        on_delete=models.CASCADE,
        related_name='recetas_como_producto_final', 
        null=True, 
        blank=True,
        unique=True  # Ensures one recipe per product
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    activa = models.BooleanField(default=True)
    notas = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        if self.producto_elaborado:
            return f"Receta: {self.producto_elaborado.nombre_producto}"
        else:
            return f"Receta (borrador): {self.nombre}"

class RecetasDetalles(models.Model):
    """
    Documents which components are used in each recipe
    NO quantities - user specifies during production
    """
    receta = models.ForeignKey(
        Recetas, 
        on_delete=models.CASCADE, 
        related_name='componentes'
    )
    
    # Component options (exactly one must be specified)
    componente_materia_prima = models.ForeignKey(
        'inventario.MateriasPrimas', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    componente_producto_intermedio = models.ForeignKey(
        'inventario.ProductosElaborados', 
        on_delete=models.CASCADE, 
        related_name='usado_en_recetas', 
        null=True, 
        blank=True
    )
    
    # Optional recipe step information
    orden_en_receta = models.IntegerField(default=1)
    instrucciones = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        componente = None
        if self.componente_materia_prima:
            componente = self.componente_materia_prima.nombre
        elif self.componente_producto_intermedio:
            componente = self.componente_producto_intermedio.nombre_producto
        
        return f"{self.receta.nombre} - {componente}"

    class Meta:
        constraints = [
            # Ensure exactly one component type is specified
            models.CheckConstraint(
                check=(
                    (Q(componente_materia_prima__isnull=False) & 
                     Q(componente_producto_intermedio__isnull=True)) |
                    (Q(componente_materia_prima__isnull=True) & 
                     Q(componente_producto_intermedio__isnull=False))
                ),
                name="receta_detalle_un_solo_tipo_componente"
            )
        ]
        ordering = ['orden_en_receta']

class RelacionesRecetas(models.Model):
    """
    Handles recipe-to-recipe relationships (recipe hierarchies)
    This is where you define which recipes use other recipes as baselines
    """
    receta_padre = models.ForeignKey(
        Recetas, 
        on_delete=models.CASCADE, 
        related_name='sub_recetas_usadas',
        help_text="Recipe that uses another recipe as component"
    )
    receta_hija = models.ForeignKey(
        Recetas, 
        on_delete=models.CASCADE, 
        related_name='usada_como_base_en',
        help_text="Recipe used as baseline/component in another recipe"
    )
    orden_en_proceso = models.IntegerField(
        default=1,
        help_text="Order in which this sub-recipe is used"
    )
    notas = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return f"{self.receta_padre.nombre} usa como base: {self.receta_hija.nombre}"
    
    class Meta:
        unique_together = ['receta_padre', 'receta_hija']
        constraints = [
            models.CheckConstraint(
                check=~Q(receta_padre=models.F('receta_hija')),
                name="no_self_referencing_recipes"
            )
        ]
        ordering = ['orden_en_proceso']
```

## ✅ What This Simplified Implementation Achieves

### 1. **Clean Separation of Concerns**
- **`Recetas`**: Simple documentation of what components are used
- **`RecetasDetalles`**: Lists raw materials and intermediate products for each recipe
- **`RelacionesRecetas`**: Handles recipe-to-recipe relationships separately

### 2. **Recipe Hierarchies Made Simple**
- Any recipe can be used as a baseline (no special flag needed)
- `RelacionesRecetas` explicitly defines parent-child relationships
- Clear distinction between material components and recipe relationships

### 3. **Example Usage**
```python
# Create base recipes
masa_pizza = Recetas.objects.create(nombre="Masa de Pizza Base")
salsa_tomate = Recetas.objects.create(nombre="Salsa de Tomate Base")

# Add components to base recipes
RecetasDetalles.objects.create(
    receta=masa_pizza,
    componente_materia_prima=harina
)
RecetasDetalles.objects.create(
    receta=salsa_tomate,
    componente_materia_prima=tomate
)

# Create final product recipe
pizza_margarita = Recetas.objects.create(
    nombre="Pizza Margarita",
    producto_elaborado=pizza_product
)

# Add regular components
RecetasDetalles.objects.create(
    receta=pizza_margarita,
    componente_materia_prima=queso_mozzarella
)

# Link to base recipes (this is the key!)
RelacionesRecetas.objects.create(
    receta_padre=pizza_margarita,
    receta_hija=masa_pizza,
    orden_en_proceso=1
)
RelacionesRecetas.objects.create(
    receta_padre=pizza_margarita,
    receta_hija=salsa_tomate,
    orden_en_proceso=2
)
```

### 4. **Production Flow**
1. **Recipe Documentation**: `RecetasDetalles` shows what components are needed
2. **Recipe Relationships**: `RelacionesRecetas` shows which base recipes to follow first
3. **Production**: User specifies actual quantities used during production
4. **Flexibility**: Recipe serves as a guide, not a rigid formula

## 🎯 **Key Benefits**

### **Simplicity**
- No unnecessary complexity with quantities in recipes
- Clear separation between documentation and actual production

### **Flexibility** 
- Any recipe can be a baseline without special flags
- Users control actual quantities during production
- Easy to modify relationships without touching component lists

### **Clarity**
- `RecetasDetalles` = "What ingredients does this recipe use?"
- `RelacionesRecetas` = "What other recipes should I make first?"

This approach perfectly matches your requirements: recipes as documentation, flexible baseline usage, and clear separation of component relationships vs recipe relationships!