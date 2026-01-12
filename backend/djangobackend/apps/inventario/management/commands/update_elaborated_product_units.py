import csv
import os
from django.core.management.base import BaseCommand
from apps.inventario.models import ProductosElaborados
from apps.core.models import UnidadesDeMedida

class Command(BaseCommand):
    help = 'Actualiza unidad_produccion_id y unidad_venta_id de ProductosElaborados desde un CSV'

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_file', 
            type=str, 
            nargs='?', 
            default='/home/davidprz/projects/PanaderiaSystem/DataProductosElaborados_Corregido.csv',
            help='Ruta al archivo CSV'
        )

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']

        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'El archivo no existe: {csv_file_path}'))
            return

        self.stdout.write(self.style.SUCCESS(f'Leyendo archivo: {csv_file_path}'))

        updated_count = 0
        skipped_count = 0
        not_found_count = 0
        errors_count = 0

        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                nombre_producto = row.get('nombre_producto') or row.get('nombre')
                if not nombre_producto:
                    continue

                try:
                    # Parse IDs and boolean from CSV
                    try:
                        nuevo_produccion_id = int(row['unidad_produccion_id']) if row['unidad_produccion_id'] else None
                        nuevo_venta_id = int(row['unidad_venta_id']) if row['unidad_venta_id'] else None
                        es_intermediario_csv = row['es_intermediario'].strip().lower() == 'true'
                    except ValueError as e:
                        self.stdout.write(self.style.ERROR(f'Error parseando datos para {nombre_producto}: {e}'))
                        errors_count += 1
                        continue

                    # Buscar producto
                    try:
                        producto = ProductosElaborados.objects.get(nombre_producto=nombre_producto)
                    except ProductosElaborados.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f'Producto no encontrado: {nombre_producto}'))
                        not_found_count += 1
                        continue

                    # Verificar si el tipo coincide (Final vs Intermedio)
                    if producto.es_intermediario != es_intermediario_csv:
                        self.stdout.write(self.style.WARNING(
                            f'Discrepancia en es_intermediario para {nombre_producto}. '
                            f'BD: {producto.es_intermediario}, CSV: {es_intermediario_csv}. Se omitirá.'
                        ))
                        errors_count += 1
                        continue

                    # Verificar integridad de foreign keys antes de asignar (opcional pero seguro)
                    if nuevo_produccion_id and not UnidadesDeMedida.objects.filter(id=nuevo_produccion_id).exists():
                         self.stdout.write(self.style.ERROR(f'Unidad Produccion ID {nuevo_produccion_id} no existe para {nombre_producto}'))
                         errors_count += 1
                         continue
                    
                    if nuevo_venta_id and not UnidadesDeMedida.objects.filter(id=nuevo_venta_id).exists():
                         self.stdout.write(self.style.ERROR(f'Unidad Venta ID {nuevo_venta_id} no existe para {nombre_producto}'))
                         errors_count += 1
                         continue

                    # Comprobar cambios
                    cambios = False
                    
                    current_produccion_id = producto.unidad_produccion_id
                    current_venta_id = producto.unidad_venta_id

                    if current_produccion_id != nuevo_produccion_id:
                        producto.unidad_produccion_id = nuevo_produccion_id
                        cambios = True

                    # Logic to handle unit_venta based on product type
                    if producto.es_intermediario:
                        # Intermediate products MUST have unidad_venta as None
                        if current_venta_id is not None:
                            producto.unidad_venta_id = None
                            cambios = True
                        elif nuevo_venta_id is not None:
                             # CSV provides a value, but logic dictates it should be None. 
                             # We ignore the CSV value for unit_venta and do not attempt to set it.
                             pass
                    else:
                        # Final products should update unidad_venta
                        if current_venta_id != nuevo_venta_id:
                             producto.unidad_venta_id = nuevo_venta_id
                             cambios = True

                    if cambios:
                        try:
                            producto.save()
                            self.stdout.write(self.style.SUCCESS(f'Actualizado {nombre_producto}: Prod {current_produccion_id}->{nuevo_produccion_id}, Venta {current_venta_id}->{producto.unidad_venta_id}'))
                            updated_count += 1
                        except Exception as save_error:
                             self.stdout.write(self.style.ERROR(f'Error guardando {nombre_producto}: {save_error}'))
                             errors_count += 1
                    else:
                        # self.stdout.write(f'Sin cambios para {nombre_producto}')
                        skipped_count += 1

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error procesando {nombre_producto}: {e}'))
                    errors_count += 1

        self.stdout.write(self.style.SUCCESS('--------------------------------------------------'))
        self.stdout.write(self.style.SUCCESS(f'Proceso completado.'))
        self.stdout.write(f'Actualizados: {updated_count}')
        self.stdout.write(f'Omitidos (sin cambios): {skipped_count}')
        self.stdout.write(f'No encontrados: {not_found_count}')
        self.stdout.write(f'Errores: {errors_count}')
