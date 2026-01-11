import os
import re
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.produccion.models import Recetas, RecetasDetalles
from apps.inventario.models import ProductosElaborados, MateriasPrimas


class Command(BaseCommand):
    help = 'Register recipes from Recetas.md file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--md-path',
            type=str,
            default='Recetas.md',
            help='Path to the Recetas.md file (default: Recetas.md in project root)'
        )

    def handle(self, *args, **options):
        md_path = options['md_path']
        
        # If relative path, resolve from project root
        if not os.path.isabs(md_path):
            # Get project root (from commands dir: go up 7 levels)
            current_file = os.path.abspath(__file__)
            base_dir = os.path.dirname(current_file)
            for _ in range(6):
                base_dir = os.path.dirname(base_dir)
            md_path = os.path.join(base_dir, md_path)
        
        if not os.path.exists(md_path):
            self.stdout.write(self.style.ERROR(f'Markdown file not found: {md_path}'))
            return
        
        self.stdout.write(self.style.NOTICE(f'Reading recipes from: {md_path}'))
        
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse recipes
            recipes = self.parse_recipes(content)
            
            # Import recipes
            with transaction.atomic():
                created_count = 0
                skipped_count = 0
                
                for recipe_data in recipes:
                    try:
                        # Check if recipe already exists
                        if Recetas.objects.filter(producto_elaborado__SKU=recipe_data['sku']).exists():
                            self.stdout.write(self.style.WARNING(
                                f'Recipe for {recipe_data["sku"]} already exists, skipping'
                            ))
                            skipped_count += 1
                            continue
                        
                        # Get the product
                        try:
                            producto = ProductosElaborados.objects.get(SKU=recipe_data['sku'])
                        except ProductosElaborados.DoesNotExist:
                            self.stdout.write(self.style.ERROR(
                                f'Product {recipe_data["sku"]} not found, skipping recipe'
                            ))
                            skipped_count += 1
                            continue
                        
                        # Create recipe
                        receta = Recetas.objects.create(
                            nombre=f"Receta {producto.nombre_producto}",
                            producto_elaborado=producto,
                            notas=f"Rendimiento: {recipe_data['rendimiento']}"
                        )
                        
                        # Create recipe details
                        for ingrediente in recipe_data['ingredientes']:
                            tipo = ingrediente['tipo']
                            cantidad = Decimal(str(ingrediente['cantidad']))
                            
                            if tipo == 'MP':
                                # Materia Prima
                                sku = ingrediente['sku']
                                try:
                                    materia_prima = MateriasPrimas.objects.get(SKU=sku)
                                    RecetasDetalles.objects.create(
                                        receta=receta,
                                        componente_materia_prima=materia_prima,
                                        cantidad=cantidad
                                    )
                                except MateriasPrimas.DoesNotExist:
                                    self.stdout.write(self.style.WARNING(
                                        f'Materia Prima {sku} not found for recipe {recipe_data["sku"]}'
                                    ))
                            elif tipo == 'PI':
                                # Producto Intermedio
                                sku = ingrediente['sku']
                                try:
                                    producto_intermedio = ProductosElaborados.objects.get(
                                        SKU=sku,
                                        es_intermediario=True
                                    )
                                    RecetasDetalles.objects.create(
                                        receta=receta,
                                        componente_producto_intermedio=producto_intermedio,
                                        cantidad=cantidad
                                    )
                                except ProductosElaborados.DoesNotExist:
                                    self.stdout.write(self.style.WARNING(
                                        f'Producto Intermedio {sku} not found for recipe {recipe_data["sku"]}'
                                    ))
                        
                        created_count += 1
                        self.stdout.write(self.style.SUCCESS(
                            f'Created recipe for {recipe_data["sku"]} with {len(recipe_data["ingredientes"])} ingredients'
                        ))
                        
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(
                            f'Error creating recipe for {recipe_data.get("sku", "unknown")}: {str(e)}'
                        ))
                        skipped_count += 1
                        continue
                
                # Summary
                self.stdout.write(self.style.SUCCESS(f'\n=== Summary ==='))
                self.stdout.write(self.style.SUCCESS(f'Recipes created: {created_count}'))
                self.stdout.write(self.style.WARNING(f'Recipes skipped: {skipped_count}'))
                
                # Verification
                total_recipes = Recetas.objects.count()
                intermediate_recipes = Recetas.objects.filter(
                    producto_elaborado__es_intermediario=True
                ).count()
                final_recipes = Recetas.objects.filter(
                    producto_elaborado__es_intermediario=False
                ).count()
                
                self.stdout.write(self.style.SUCCESS(f'\n=== Verification ==='))
                self.stdout.write(self.style.SUCCESS(f'Total recipes in DB: {total_recipes}'))
                self.stdout.write(self.style.SUCCESS(f'Intermediate product recipes: {intermediate_recipes}'))
                self.stdout.write(self.style.SUCCESS(f'Final product recipes: {final_recipes}'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise

    def parse_recipes(self, content):
        """Parse recipes from markdown content"""
        recipes = []
        
        # Split by recipe sections (### headers)
        recipe_sections = re.split(r'\n### (PE-(?:INT|FIN)-\d+):', content)
        
        # Skip the first element (intro text)
        for i in range(1, len(recipe_sections), 2):
            if i + 1 >= len(recipe_sections):
                break
                
            sku = recipe_sections[i].strip()
            recipe_content = recipe_sections[i + 1]
            
            # Extract recipe name (first line after SKU)
            lines = recipe_content.strip().split('\n')
            nombre = lines[0].strip() if lines else ''
            
            # Extract rendimiento
            rendimiento_match = re.search(r'\*\*Rendimiento\*\*:\s*(.+)', recipe_content)
            rendimiento = rendimiento_match.group(1).strip() if rendimiento_match else ''
            
            # Extract ingredients table
            ingredientes = []
            
            # Find the table (starts with | Ingrediente |)
            table_match = re.search(
                r'\| Ingrediente \| Tipo \| Cantidad \| Unidad \|.*?\n\|[-\s|]+\n((?:\|.+\n)+)',
                recipe_content,
                re.MULTILINE
            )
            
            if table_match:
                table_rows = table_match.group(1).strip().split('\n')
                
                for row in table_rows:
                    # Parse table row
                    cells = [cell.strip() for cell in row.split('|')[1:-1]]  # Skip first and last empty cells
                    
                    if len(cells) >= 4:
                        ingrediente_text = cells[0]
                        tipo = cells[1]
                        cantidad_str = cells[2]
                        unidad = cells[3]
                        
                        # Extract SKU from ingrediente text (in parentheses)
                        sku_match = re.search(r'\(([A-Z]+-[A-Z]+-\d+)\)', ingrediente_text)
                        if sku_match:
                            ingrediente_sku = sku_match.group(1)
                            
                            # Parse cantidad
                            try:
                                cantidad = float(cantidad_str)
                                
                                ingredientes.append({
                                    'sku': ingrediente_sku,
                                    'tipo': tipo,
                                    'cantidad': cantidad,
                                    'unidad': unidad
                                })
                            except ValueError:
                                self.stdout.write(self.style.WARNING(
                                    f'Could not parse cantidad "{cantidad_str}" for {sku}'
                                ))
            
            if ingredientes:  # Only add recipe if it has ingredients
                recipes.append({
                    'sku': sku,
                    'nombre': nombre,
                    'rendimiento': rendimiento,
                    'ingredientes': ingredientes
                })
        
        return recipes
