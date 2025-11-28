from apps.inventario.models import (
    MateriasPrimas, 
    ProductosFinales,
    ProductosIntermedios,
    ProductosReventa,
    LotesMateriasPrimas,
    LotesProductosElaborados,
    LotesProductosReventa,
    LotesStatus
)

from apps.ventas.models import (
    OrdenVenta
)

from apps.core.models import (
    EstadosOrdenVenta, 
    TiposOrdenVenta,
    TiposNotificaciones,
    TiposPrioridades,
    Notificaciones
)


class NotificationService:

    TIME_FOR_DELIVERY = {
        '7': timezone.now().date() + timedelta(days=7),
        '3': timezone.now().date() + timedelta(days=3),
        '1': timezone.now().date() + timedelta(days=1),
    }

    ALERT_TIER_DELIVERY = {
        '7': 'Media',
        '3': 'Alta',
        '1': 'Crítica',
    }
    

    EXPERATION_TIME_DAYS = {
            '30': timezone.now().date() + timedelta(days=30),
            '14': timezone.now().date() + timedelta(days=14),
            '7': timezone.now().date() + timedelta(days=7),
            '3': timezone.now().date() + timedelta(days=3),
            '1': timezone.now().date() + timedelta(days=1),
    }

    ALERT_TIER_LONG = {
        '30': 'Baja',
        '14': 'Media',
        '7': 'Alta',
        '3': 'Alta',
        '1': 'Crítica',
    }

    ALERT_TIER_SHORT = {
        '7': 'Media',
        '3': 'Alta',
        '1': 'Crítica',
    }


    @classmethod
    def check_low_stock(cls, producto):

        if not isinstance(producto, (MateriasPrimas, ProductosFinales, ProductosIntermedios, ProductosReventa)):
            raise Exception('El producto no es una instancia de MateriasPrimas, ProductosFinales, ProductosIntermedios o ProductosReventa')

        products_reorder_point_map = {}

        products_data = producto.objects.all()

        for producto in products_data:
            products_reorder_point_map[producto.id] = producto.punto_reorden

        productos_low_stock = []

        for producto in products_data:
            producto_reorder_point = products_reorder_point_map[producto.id]

            if producto.stock_actual <= producto_reorder_point and producto.stock_actual > 0:
                productos_low_stock.append({
                    'producto_id': producto.id,
                    'tipo_producto': cls.get_tipo_producto(producto),
                    'prioridad': TiposPrioridades.ALTA,
                    'descripcion': f'¡El producto {producto.nombre} se encuentra por debajo del punto de reorden ⚠️!',
                })

        cls.create_notification(productos_low_stock, TiposNotificaciones.BAJO_STOCK)    


    @classmethod
    def check_sin_stock(cls, producto):
        if not isinstance(producto, (MateriasPrimas, ProductosFinales, ProductosIntermedios, ProductosReventa)):
            raise Exception('El producto no es una instancia de MateriasPrimas, ProductosFinales, ProductosIntermedios o ProductosReventa')

        products_data = producto.objects.all()

        productos_sin_stock = []

        for producto in products_data:
            if producto.stock_actual <= 0:
                productos_sin_stock.append({
                    'producto_id': producto.id,
                    'tipo_producto': cls.get_tipo_producto(producto),
                    'prioridad': TiposPrioridades.CRITICA,
                    'descripcion': f'¡El producto {producto.nombre} se encuentra sin stock 🚨!',
                })

        cls.create_notification(productos_sin_stock, TiposNotificaciones.SIN_STOCK)


    @classmethod
    def check_expiration_date(cls, producto, lots):
        if not isinstance(producto, (MateriasPrimas, ProductosElaborados, ProductosReventa)):
            raise Exception('El producto no es una instancia de MateriasPrimas, ProductosElaborados o ProductosReventa')

        if not isinstance(lots, (LotesMateriasPrimas, LotesProductosElaborados, LotesProductosReventa)):
            raise Exception('El lote no es una instancia de LotesMateriasPrimas, LotesProductosElaborados o LotesProductosReventa')
        
        lots_data = []

        if isinstance(producto, MateriasPrimas):
            lots_data = lots.objects.filter(materia_prima=producto, estado=LotesStatus.DISPONIBLE)

        elif isinstance(producto, ProductosReventa):
            lots_data = lots.objects.filter(producto_reventa=producto, estado=LotesStatus.DISPONIBLE)
        
        elif isinstance(producto, ProductosElaborados):
            lots_data = lots.objects.filter(producto_elaborado=producto, estado=LotesStatus.DISPONIBLE)
        
        lots_expiration_date = []

        for lot in lots_data:
            for time in cls.EXPERATION_TIME_DAYS:
                if lot.fecha_caducidad == cls.EXPERATION_TIME_DAYS[time]:
                    if isinstance(lot, LotesMateriasPrimas) or isinstance(lot, LotesProductosReventa):
                        lots_expiration_date.append({
                            'tipo_producto': cls.get_tipo_producto(producto),
                            'producto_id': producto.id,
                            'descripcion': f'¡Lote #{lot.id} de {producto.nombre} EXPIRA en {time} día(s) ⚠️!',
                            'prioridad': cls.ALERT_TIER_LONG[time]
                            })
                    elif isinstance(lot, LotesProductosElaborados):
                        lots_expiration_date.append({
                            'tipo_producto': cls.get_tipo_producto(producto),
                            'producto_id': producto.id,
                            'descripcion': f'¡Lote #{lot.id} de {producto.nombre} EXPIRA en {time} día(s) ⚠️!',
                            'prioridad': cls.ALERT_TIER_SHORT[time]
                            })

        cls.create_notification(lots_expiration_date, TiposNotificaciones.EXPIRACION)


    @classmethod
    def check_order_date(cls):
        estado_id = EstadosOrdenVenta.objects.get(nombre_estado=TiposOrdenVenta.EN_PROCESO)
        ordenes_en_proceso = OrdenVenta.objects.filter(estado_orden=estado_id)

        ordenes_notificar = []
        for orden in ordenes_en_proceso:
            for time in cls.TIME_FOR_DELIVERY:

                if orden.fecha_entrega == cls.TIME_FOR_DELIVERY[time]:
                    ordenes_notificar.append({
                            'producto_id': orden.id, 
                            'tipo_producto': 'Orden de Venta',
                            'descripcion': f"El pedido #{orden.id} para el cliente {orden.cliente.nombre_cliente} se entregara en {time} día(s) ⏳",
                            'prioridad': cls.ALERT_TIER_DELIVERY[time]
                        })
        
        cls.create_notification(ordenes_notificar, TiposNotificaciones.ENTREGA_CERCANA)


    def get_tipo_producto(producto):
        if isinstance(producto, MateriasPrimas):
            return 'Materia Prima'
        elif isinstance(producto, ProductosFinales):
            return 'Producto Final'
        elif isinstance(producto, ProductosIntermedios):
            return 'Producto Intermedio'
        elif isinstance(producto, ProductosReventa):
            return 'Producto de Reventa'


    @classmethod
    def create_notification(cls, elementos, tipo_notificacion):
        
        notification_bucket = []
    
        for elemento in elementos:
            notification = Notificaciones(
                tipo_notificacion=tipo_notificacion,
                tipo_producto=elemento.get('tipo_producto'),
                producto_id=elemento.get('producto_id'),
                descripcion=elemento.get('descripcion'),
                prioridad=elemento.get('prioridad'),
            )

            notification_bucket.append(notification)

        Notificaciones.objects.bulk_create(notification_bucket)


    def __init__(self):
        pass