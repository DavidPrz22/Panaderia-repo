from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connections, transaction
from apps.core.models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, CategoriasProductosReventa, MetodosDePago, EstadosOrdenVenta, EstadosOrdenCompra, ConversionesUnidades
from apps.inventario.models import MateriasPrimas, ProductosElaborados, ProductosReventa, LotesMateriasPrimas, LotesProductosElaborados, LotesProductosReventa
from apps.produccion.models import Recetas, RecetasDetalles, DefinicionTransformacion, Produccion, DetalleProduccionCosumos, DetalleProduccionLote
from apps.compras.models import Proveedores, OrdenesCompra, DetalleOrdenesCompra

from apps.users.models import User

class Command(BaseCommand):
    help = 'Synchronizes specific data from Neon (default) to Local SQLite (local)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting synchronization...'))

        # 1. Ensure local tables exist
        self.stdout.write('Checking local tables...')
        call_command('migrate', database='local', interactive=False)

        # 2. List of models to sync in order of dependencies
        models_to_sync = [
            # User Management
            User,
            
            # Core / Foundation
            UnidadesDeMedida,
            CategoriasMateriaPrima,
            CategoriasProductosElaborados,
            CategoriasProductosReventa,
            MetodosDePago,
            EstadosOrdenVenta,
            EstadosOrdenCompra,
            ConversionesUnidades,
            
            # Entities
            Proveedores,
            MateriasPrimas,
            ProductosElaborados,
            ProductosReventa,
            
            # Compras (Dependencies for Lotes)
            OrdenesCompra,
            DetalleOrdenesCompra,
            
            # Logic / Config
            Recetas,
            RecetasDetalles,
            DefinicionTransformacion,
            
            # Production Events
            Produccion,
            DetalleProduccionCosumos,
            
            # Active Stock / Batches
            LotesMateriasPrimas,
            LotesProductosElaborados,
            LotesProductosReventa,
            
            # Post-Lote Links
            DetalleProduccionLote,
        ]

        for model in models_to_sync:
            self.sync_model(model)

        self.stdout.write(self.style.SUCCESS('Successfully synchronized local database.'))

    def sync_model(self, model):
        model_name = model.__name__
        self.stdout.write(f'Syncing {model_name}...')

        # Fetch all from Neon
        remote_data = model.objects.using('default').all()
        count = 0

        # Disable FK checks for SQLite to allow syncing complex dependencies
        with connections['local'].cursor() as cursor:
            cursor.execute('PRAGMA foreign_keys = OFF;')

        with transaction.atomic(using='local'):
            for remote_obj in remote_data:
                data = {}
                for field in remote_obj._meta.fields:
                    if field.is_relation:
                        # Get the raw ID without fetching the object
                        data[f"{field.name}_id"] = getattr(remote_obj, f"{field.name}_id")
                    else:
                        data[field.name] = getattr(remote_obj, field.name)

                model.objects.using('local').update_or_create(
                    id=remote_obj.id,
                    defaults=data
                )
                count += 1
        
        with connections['local'].cursor() as cursor:
            cursor.execute('PRAGMA foreign_keys = ON;')

        self.stdout.write(self.style.SUCCESS(f'  - {count} items processed for {model_name}'))
