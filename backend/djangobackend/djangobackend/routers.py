class HybridRouter:
    """
    A router to control all database operations on models in the
    Panaderia System.
    
    - Writes: Always go to 'default' (Online/Neon).
    - Reads: Try to go to 'local' (Offline/SQLite) for specific apps.
    """
    
    # Apps that we want to read from the local cache for speed
    LOCAL_READ_APPS = {'inventario', 'core', 'produccion', 'compras', 'users'}

    def db_for_read(self, model, **hints):
        """
        Reads go to 'local' if the app is in LOCAL_READ_APPS, 
        otherwise go to 'default'.
        """
        if model._meta.app_label in self.LOCAL_READ_APPS:
            return 'local'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        All writes always go to the master database (Neon).
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if both objects are in the same database 
        or if we are relating across the hybrid setup.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Ensure all models are migrated to both databases.
        SQLite will hold a copy of the schema.
        """
        return True
