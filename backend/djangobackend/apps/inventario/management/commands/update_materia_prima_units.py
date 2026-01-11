import csv
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.inventario.models import MateriasPrimas

class Command(BaseCommand):
    help = 'Update unit IDs for MateriasPrimas from CSV based on SKU'

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv-path',
            type=str,
            default='DataMateriasPrimas_Corregido.csv',
            help='Path to the CSV file (default: DataMateriasPrimas_Corregido.csv in project root)'
        )

    def handle(self, *args, **options):
        csv_path = options['csv_path']
        
        # Resolve relative path
        if not os.path.isabs(csv_path):
            # Base dir is project root (PanaderiaSystem)
            # This file is in backend/djangobackend/apps/inventario/management/commands/
            # We need to go up 5 levels to get to project root if we are running from manage.py location,
            # but usually manage.py is run from backend/djangobackend.
            # Let's assume the path is relative to where the command is run (usually backend root) or project root.
            # To be safe, let's look for the file in common locations.
            
            potential_paths = [
                csv_path,
                os.path.join(os.getcwd(), csv_path),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))), csv_path), # App root -> ... -> PanaderiaSystem
                os.path.join('../..', csv_path) # Up from backend/djangobackend
            ]
            
            found_path = None
            for p in potential_paths:
                if os.path.exists(p):
                    found_path = p
                    break
            
            if found_path:
                csv_path = found_path
            else:
                 # Fallback to absolute path strategy if not found
                current_file = os.path.abspath(__file__)
                # Go up to PanaderiaSystem root
                # .../apps/inventario/management/commands/file.py
                base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_file))))))
                csv_path = os.path.join(base_dir, options['csv_path'])

        if not os.path.exists(csv_path):
            self.stdout.write(self.style.ERROR(f'CSV file not found: {csv_path}'))
            return

        self.stdout.write(self.style.NOTICE(f'Reading CSV from: {csv_path}'))

        updated_count = 0
        processed_count = 0
        skipped_count = 0
        not_found_count = 0

        try:
            with open(csv_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                
                # Verify headers
                required_headers = ['SKU', 'unidad_medida_base_id', 'unidad_medida_empaque_estandar_id']
                if not all(h in reader.fieldnames for h in required_headers):
                    self.stdout.write(self.style.ERROR(f'CSV missing required headers. Found: {reader.fieldnames}'))
                    return

                with transaction.atomic():
                    for row in reader:
                        processed_count += 1
                        sku = row['SKU'].strip()
                        
                        try:
                            # Optimization: Only select necessary fields
                            materia_prima = MateriasPrimas.objects.only(
                                'id', 'SKU', 'nombre', 'unidad_medida_base_id', 'unidad_medida_empaque_estandar_id'
                            ).get(SKU=sku)
                            
                            new_base_id = int(row['unidad_medida_base_id'])
                            new_empaque_id = int(row['unidad_medida_empaque_estandar_id']) if row['unidad_medida_empaque_estandar_id'] else None
                            
                            changed = False
                            
                            if materia_prima.unidad_medida_base_id != new_base_id:
                                self.stdout.write(f"Updating {sku} ({materia_prima.nombre}): Base Unit {materia_prima.unidad_medida_base_id} -> {new_base_id}")
                                materia_prima.unidad_medida_base_id = new_base_id
                                changed = True
                                
                            if materia_prima.unidad_medida_empaque_estandar_id != new_empaque_id:
                                self.stdout.write(f"Updating {sku} ({materia_prima.nombre}): Empaque Unit {materia_prima.unidad_medida_empaque_estandar_id} -> {new_empaque_id}")
                                materia_prima.unidad_medida_empaque_estandar_id = new_empaque_id
                                changed = True
                            
                            if changed:
                                materia_prima.save(update_fields=['unidad_medida_base', 'unidad_medida_empaque_estandar'])
                                updated_count += 1
                            else:
                                skipped_count += 1
                                
                        except MateriasPrimas.DoesNotExist:
                            self.stdout.write(self.style.WARNING(f'Materia Prima with SKU {sku} not found based on CSV row.'))
                            not_found_count += 1
                        except ValueError as e:
                            self.stdout.write(self.style.ERROR(f'Error parsing IDs for SKU {sku}: {e}'))
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f'Unexpected error processing SKU {sku}: {e}'))

            self.stdout.write(self.style.SUCCESS(f'\nProcess completed.'))
            self.stdout.write(f'Total processed: {processed_count}')
            self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count}'))
            self.stdout.write(f'Skipped (No changes): {skipped_count}')
            self.stdout.write(self.style.WARNING(f'Not Found: {not_found_count}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to read CSV: {e}'))
