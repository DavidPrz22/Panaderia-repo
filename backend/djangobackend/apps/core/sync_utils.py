import threading
import queue
import time
from django.db import transaction, connections
from django.db.models.signals import post_save, post_delete

# Create a queue for sync tasks to serialize writes
SYNC_QUEUE = queue.Queue()

def sync_worker():
    """
    Worker thread that processes sync tasks sequentially.
    This prevents 'database is locked' errors by ensuring only one thread 
    writes to the local SQLite database at a time.
    """
    # Optional: Enable WAL mode for better concurrency
    try:
        with connections['local'].cursor() as cursor:
            cursor.execute('PRAGMA journal_mode=WAL;')
    except Exception:
        pass

    while True:
        try:
            task = SYNC_QUEUE.get()
            if task is None:
                break
            
            model_class, instance_id, deleted = task
            perform_sync(model_class, instance_id, deleted)
            
        except Exception as e:
            print(f"Sync Worker Error: {e}")
        finally:
            SYNC_QUEUE.task_done()

def perform_sync(model_class, instance_id, deleted):
    """
    The actual sync logic, moved out of the thread spawner.
    """
    try:
        if deleted:
            # Handle deletion
            model_class.objects.using('local').filter(id=instance_id).delete()
            return

        # Fetch the latest data from Neon (default)
        remote_obj = model_class.objects.using('default').filter(id=instance_id).first()
        if not remote_obj:
            return

        # Prepare data for entry
        data = {}
        for field in remote_obj._meta.fields:
            if field.is_relation:
                # Store the ID directly
                data[f"{field.name}_id"] = getattr(remote_obj, f"{field.name}_id")
            else:
                data[field.name] = getattr(remote_obj, field.name)

        # Update or create in local SQLite
        # We disable foreign key checks temporarily for this operation to avoid order issues
        with connections['local'].cursor() as cursor:
            cursor.execute('PRAGMA foreign_keys = OFF;')
            
        model_class.objects.using('local').update_or_create(
            id=remote_obj.id,
            defaults=data
        )

        with connections['local'].cursor() as cursor:
            cursor.execute('PRAGMA foreign_keys = ON;')

    except Exception as e:
        print(f"Background Sync Error for {model_class.__name__} {instance_id}: {e}")

# Start the worker thread
thread = threading.Thread(target=sync_worker, daemon=True)
thread.start()

def sync_instance_to_local(model_class, instance_id, deleted=False):
    """
    Enqueues a sync task instead of spawning a new thread immediately.
    """
    SYNC_QUEUE.put((model_class, instance_id, deleted))


def register_sync_signals():
    """
    Connects signals for all models that should be mirrored locally.
    """
    from apps.core.models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, CategoriasProductosReventa, MetodosDePago, EstadosOrdenVenta, EstadosOrdenCompra, ConversionesUnidades, Notificaciones
    from apps.inventario.models import MateriasPrimas, ProductosElaborados, ProductosReventa, LotesMateriasPrimas, LotesProductosElaborados, LotesProductosReventa
    from apps.produccion.models import Recetas, RecetasDetalles, DefinicionTransformacion
    from apps.users.models import User
    from apps.compras.models import Proveedores, OrdenesCompra, DetalleOrdenesCompra

    models_to_watch = [
        User, UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, 
        CategoriasProductosReventa, MetodosDePago, EstadosOrdenVenta, EstadosOrdenCompra, 
        ConversionesUnidades, Notificaciones, Proveedores, MateriasPrimas, 
        ProductosElaborados, ProductosReventa, OrdenesCompra, DetalleOrdenesCompra, 
        Recetas, RecetasDetalles, DefinicionTransformacion, LotesMateriasPrimas, 
        LotesProductosElaborados, LotesProductosReventa
    ]

    for model in models_to_watch:
        # Create a specific wrapper for each model to avoid closure issues
        def make_save_handler(m):
            def handle_save(sender, instance, **kwargs):
                # We only sync if the change happened in the 'default' database
                # to avoid loops or redundant local-to-local syncing
                if kwargs.get('using') == 'default' or kwargs.get('using') is None:
                    # Use on_commit to ensure the data is actually in the DB 
                    # before the background thread tries to read it.
                    transaction.on_commit(lambda: sync_instance_to_local(m, instance.id))
            return handle_save

        def make_delete_handler(m):
            def handle_delete(sender, instance, **kwargs):
                if kwargs.get('using') == 'default' or kwargs.get('using') is None:
                     transaction.on_commit(lambda: sync_instance_to_local(m, instance.id, deleted=True))
            return handle_delete

        post_save.connect(make_save_handler(model), sender=model, dispatch_uid=f"sync_save_{model.__name__}")
        post_delete.connect(make_delete_handler(model), sender=model, dispatch_uid=f"sync_delete_{model.__name__}")
