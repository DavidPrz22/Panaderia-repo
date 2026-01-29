from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from apps.inventario.models import MateriasPrimas, LotesMateriasPrimas, LotesStatus

class Command(BaseCommand):
    help = 'Seed initial stock for MateriasPrimas by creating a lot for each with 2x point of reorder quantity.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting initial stock seeding for Materias Primas...'))

        today = timezone.now().date()
        expiration_date = today + timedelta(days=30)
        
        updated_count = 0
        skipped_count = 0
        
        try:
            materias_primas = MateriasPrimas.objects.all()
            lotes_to_create = []

            for mp in materias_primas:
                if mp.punto_reorden <= 0:
                    self.stdout.write(self.style.WARNING(f'Skipping {mp.nombre} (SKU: {mp.SKU}): Point of reorder is 0 or negative.'))
                    skipped_count += 1
                    continue

                cantidad = mp.punto_reorden * 2
                
                # Create the lot
                # We assume costo_unitario comes from the current purchase price of the MP
                costo = mp.precio_compra_usd if mp.precio_compra_usd else 0

                lote = LotesMateriasPrimas(
                    materia_prima=mp,
                    fecha_recepcion=today,
                    fecha_caducidad=expiration_date,
                    cantidad_recibida=cantidad,
                    stock_actual_lote=cantidad,
                    costo_unitario_usd=costo,
                    estado=LotesStatus.DISPONIBLE,
                    proveedor=None, # No specific provider for this seed
                    detalle_oc=None # No purchase order linked
                )
                lotes_to_create.append(lote)
                updated_count += 1

            if lotes_to_create:
                # Save individually to trigger signals (update_materia_prima_stock) automatically
                self.stdout.write(self.style.NOTICE(f'Creating {len(lotes_to_create)} lots...'))
                for i, lote in enumerate(lotes_to_create, 1):
                    lote.save()
                    if i % 10 == 0:
                        self.stdout.write(f'Created {i}/{len(lotes_to_create)} lots...')
                    
                self.stdout.write(self.style.SUCCESS(f'Successfully created {updated_count} lots.'))
            else:
                self.stdout.write(self.style.WARNING('No lots were created.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error seeding stock: {str(e)}'))
