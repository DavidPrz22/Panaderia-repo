import csv
import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.inventario.models import ProductosElaborados
from apps.core.models import UnidadesDeMedida, CategoriasProductosElaborados


class Command(BaseCommand):
    help = 'Register 100 elaborated products (50 intermediate, 50 final) from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv-path',
            type=str,
            default='PEnew.csv',
            help='Path to the CSV file (default: PEnew.csv in project root)'
        )

    def handle(self, *args, **options):
        csv_path = options['csv_path']
        
        # If relative path, resolve from project root
        if not os.path.isabs(csv_path):
            # Get project root (from commands dir: commands -> management -> inventario -> apps -> djangobackend -> backend -> PanaderiaSystem)
            current_file = os.path.abspath(__file__)
            # Go up 7 levels: commands -> management -> inventario -> apps -> djangobackend -> backend -> PanaderiaSystem
            base_dir = os.path.dirname(current_file)  # commands
            for _ in range(6):
                base_dir = os.path.dirname(base_dir)
            csv_path = os.path.join(base_dir, csv_path)
        
        if not os.path.exists(csv_path):
            self.stdout.write(self.style.ERROR(f'CSV file not found: {csv_path}'))
            return
        
        self.stdout.write(self.style.NOTICE(f'Reading CSV from: {csv_path}'))
        
        try:
            with transaction.atomic():
                products_to_create = []
                
                with open(csv_path, 'r', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    
                    for row_num, row in enumerate(reader, start=2):  # start=2 because row 1 is header
                        try:
                            # Parse boolean values
                            es_intermediario = row['es_intermediario'].strip().upper() == 'TRUE'
                            
                            # Get foreign key instances
                            try:
                                unidad_produccion = UnidadesDeMedida.objects.get(id=int(row['unidad_produccion_id']))
                            except UnidadesDeMedida.DoesNotExist:
                                self.stdout.write(self.style.ERROR(
                                    f'Row {row_num}: UnidadesDeMedida with id={row["unidad_produccion_id"]} not found'
                                ))
                                continue
                            
                            try:
                                categoria = CategoriasProductosElaborados.objects.get(id=int(row['categoria_id']))
                            except CategoriasProductosElaborados.DoesNotExist:
                                self.stdout.write(self.style.ERROR(
                                    f'Row {row_num}: CategoriasProductosElaborados with id={row["categoria_id"]} not found'
                                ))
                                continue
                            
                            # Handle nullable fields based on es_intermediario
                            unidad_venta = None
                            precio_venta_usd = None
                            vendible_por_medida_real = None
                            
                            if not es_intermediario:
                                # Final products must have these fields
                                if row['unidad_venta_id'].strip():
                                    try:
                                        unidad_venta = UnidadesDeMedida.objects.get(id=int(row['unidad_venta_id']))
                                    except UnidadesDeMedida.DoesNotExist:
                                        self.stdout.write(self.style.ERROR(
                                            f'Row {row_num}: UnidadesDeMedida (venta) with id={row["unidad_venta_id"]} not found'
                                        ))
                                        continue
                                
                                if row['precio_venta_usd'].strip():
                                    precio_venta_usd = Decimal(row['precio_venta_usd'])
                                
                                if row['vendible_por_medida_real'].strip():
                                    vendible_por_medida_real = row['vendible_por_medida_real'].strip().upper() == 'TRUE'
                            
                            # Create product instance
                            product = ProductosElaborados(
                                nombre_producto=row['nombre_producto'].strip(),
                                SKU=row['SKU'].strip(),
                                descripcion=row['descripcion'].strip(),
                                unidad_produccion=unidad_produccion,
                                unidad_venta=unidad_venta,
                                precio_venta_usd=precio_venta_usd,
                                punto_reorden=Decimal(row['punto_reorden']),
                                categoria=categoria,
                                es_intermediario=es_intermediario,
                                tipo_medida_fisica=row['tipo_medida_fisica'].strip(),
                                vendible_por_medida_real=vendible_por_medida_real
                            )
                            
                            products_to_create.append(product)
                            
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f'Row {row_num}: Error processing row - {str(e)}'))
                            continue
                
                # Bulk create all products
                if products_to_create:
                    ProductosElaborados.objects.bulk_create(products_to_create)
                    self.stdout.write(self.style.SUCCESS(
                        f'Successfully created {len(products_to_create)} products'
                    ))
                    
                    # Verify counts
                    total_count = ProductosElaborados.objects.count()
                    intermediate_count = ProductosElaborados.objects.filter(es_intermediario=True).count()
                    final_count = ProductosElaborados.objects.filter(es_intermediario=False).count()
                    
                    self.stdout.write(self.style.SUCCESS(f'\nVerification:'))
                    self.stdout.write(self.style.SUCCESS(f'  Total products: {total_count}'))
                    self.stdout.write(self.style.SUCCESS(f'  Intermediate products: {intermediate_count}'))
                    self.stdout.write(self.style.SUCCESS(f'  Final products: {final_count}'))
                    
                    # Verify an intermediate product has no price
                    sample_intermediate = ProductosElaborados.objects.filter(
                        SKU='PE-INT-001'
                    ).first()
                    if sample_intermediate:
                        self.stdout.write(self.style.SUCCESS(
                            f'\nSample verification (PE-INT-001):'
                        ))
                        self.stdout.write(self.style.SUCCESS(
                            f'  Name: {sample_intermediate.nombre_producto}'
                        ))
                        self.stdout.write(self.style.SUCCESS(
                            f'  Price: {sample_intermediate.precio_venta_usd} (should be None)'
                        ))
                        self.stdout.write(self.style.SUCCESS(
                            f'  Is intermediate: {sample_intermediate.es_intermediario}'
                        ))
                else:
                    self.stdout.write(self.style.WARNING('No products were created'))
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise
