# Viewsets y Endpoints - Sistema de Órdenes de Compra

## 📋 Viewsets Necesarios

### 1. OrdenesCompraViewSet

```python
# backend/djangobackend/apps/compras/viewsets.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from datetime import datetime

class OrdenesCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenesCompra.objects.all().select_related('proveedor', 'estado_oc', 'metodo_pago')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrdenCompraListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return OrdenCompraCreateUpdateSerializer
        return OrdenCompraDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros opcionales
        estado = self.request.query_params.get('estado', None)
        proveedor = self.request.query_params.get('proveedor', None)
        
        if estado:
            queryset = queryset.filter(estado_oc__nombre_estado=estado)
        if proveedor:
            queryset = queryset.filter(proveedor_id=proveedor)
        
        return queryset.order_by('-fecha_emision_oc')
    
    @action(detail=True, methods=['post'])
    def marcar_enviada(self, request, pk=None):
        """Marca la OC como enviada"""
        orden = self.get_object()
        
        if orden.estado_oc.nombre_estado != 'Emitida':
            return Response(
                {'error': 'Solo se pueden enviar órdenes en estado Emitida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        estado_enviada = EstadosOrdenCompra.objects.get(nombre_estado='Enviada')
        orden.estado_oc = estado_enviada
        orden.fecha_envio_oc = datetime.now().date()
        orden.save()
        
        return Response({'message': 'Orden marcada como enviada'})
    
    @action(detail=True, methods=['post'])
    def enviar_email(self, request, pk=None):
        """Envía la OC por email al proveedor"""
        orden = self.get_object()
        email_proveedor = request.data.get('email')
        mensaje_personalizado = request.data.get('mensaje', '')
        
        if not email_proveedor:
            return Response(
                {'error': 'Email del proveedor es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TODO: Implementar generación de PDF y envío de email
        # from .utils import generar_pdf_oc, enviar_email_oc
        # pdf = generar_pdf_oc(orden)
        # enviar_email_oc(email_proveedor, pdf, mensaje_personalizado)
        
        estado_enviada = EstadosOrdenCompra.objects.get(nombre_estado='Enviada')
        orden.estado_oc = estado_enviada
        orden.email_enviado = True
        orden.fecha_email_enviado = datetime.now()
        orden.fecha_envio_oc = datetime.now().date()
        orden.save()
        
        return Response({'message': 'Email enviado exitosamente'})
    
    @action(detail=True, methods=['get'])
    def generar_pdf(self, request, pk=None):
        """Genera el PDF de la OC"""
        orden = self.get_object()
        
        # TODO: Implementar generación de PDF
        # from .utils import generar_pdf_oc
        # pdf_file = generar_pdf_oc(orden)
        # return FileResponse(pdf_file, as_attachment=True, filename=f'OC_{orden.id}.pdf')
        
        return Response({'message': 'PDF generado'})
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """Cancela una OC"""
        orden = self.get_object()
        
        if orden.estado_oc.nombre_estado in ['Recibida Completa', 'Cancelada']:
            return Response(
                {'error': f'No se puede cancelar una OC en estado {orden.estado_oc.nombre_estado}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        estado_cancelada = EstadosOrdenCompra.objects.get(nombre_estado='Cancelada')
        orden.estado_oc = estado_cancelada
        orden.save()
        
        return Response({'message': 'Orden cancelada exitosamente'})
```

### 2. ComprasViewSet

```python
from apps.inventario.models import LotesMateriasPrimas, LotesProductosReventa

class ComprasViewSet(viewsets.ModelViewSet):
    queryset = Compras.objects.all().select_related('orden_compra', 'proveedor', 'usuario_recepcionador')
    serializer_class = CompraDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros
        proveedor = self.request.query_params.get('proveedor', None)
        pagado = self.request.query_params.get('pagado', None)
        
        if proveedor:
            queryset = queryset.filter(proveedor_id=proveedor)
        if pagado is not None:
            queryset = queryset.filter(pagado=pagado.lower() == 'true')
        
        return queryset.order_by('-fecha_recepcion')
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Crea una recepción de compra con sus lotes"""
        serializer = CompraCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        orden_compra = OrdenesCompra.objects.get(id=data['orden_compra_id'])
        
        # Crear la compra
        compra = Compras.objects.create(
            orden_compra=orden_compra,
            proveedor=orden_compra.proveedor,
            usuario_recepcionador=request.user,
            fecha_recepcion=data['fecha_recepcion'],
            numero_factura_proveedor=data.get('numero_factura_proveedor', ''),
            numero_remision=data.get('numero_remision', ''),
            notas=data.get('notas', ''),
            tasa_cambio_aplicada=orden_compra.tasa_cambio_aplicada,
        )
        
        total_recepcion_usd = 0
        
        # Procesar cada detalle
        for detalle_data in data['detalles']:
            detalle_oc = DetalleOrdenesCompra.objects.get(id=detalle_data['detalle_oc_id'])
            cantidad_recibida = detalle_data['cantidad_recibida']
            
            # Validar que no se exceda la cantidad solicitada
            nueva_cantidad_recibida = detalle_oc.cantidad_recibida + cantidad_recibida
            if nueva_cantidad_recibida > detalle_oc.cantidad_solicitada:
                raise serializers.ValidationError(
                    f"La cantidad recibida total ({nueva_cantidad_recibida}) excede la cantidad solicitada ({detalle_oc.cantidad_solicitada})"
                )
            
            # Crear detalle de compra
            detalle_compra = DetalleCompras.objects.create(
                compra=compra,
                detalle_oc=detalle_oc,
                materia_prima=detalle_oc.materia_prima,
                producto_reventa=detalle_oc.producto_reventa,
                cantidad_recibida=cantidad_recibida,
                unidad_medida=detalle_oc.unidad_medida_compra,
                costo_unitario_usd=detalle_oc.costo_unitario_usd,
                subtotal_usd=cantidad_recibida * detalle_oc.costo_unitario_usd
            )
            
            total_recepcion_usd += detalle_compra.subtotal_usd
            
            # Crear lotes
            for lote_data in detalle_data['lotes']:
                if detalle_oc.materia_prima:
                    LotesMateriasPrimas.objects.create(
                        materia_prima=detalle_oc.materia_prima,
                        proveedor=orden_compra.proveedor,
                        fecha_recepcion=compra.fecha_recepcion,
                        fecha_caducidad=lote_data['fecha_caducidad'],
                        cantidad_recibida=lote_data['cantidad'],
                        stock_actual_lote=lote_data['cantidad'],
                        costo_unitario_usd=lote_data['costo_unitario_usd'],
                        detalle_oc=detalle_oc
                    )
                elif detalle_oc.producto_reventa:
                    LotesProductosReventa.objects.create(
                        producto_reventa=detalle_oc.producto_reventa,
                        proveedor=orden_compra.proveedor,
                        fecha_recepcion=compra.fecha_recepcion,
                        fecha_caducidad=lote_data['fecha_caducidad'],
                        cantidad_recibida=lote_data['cantidad'],
                        stock_actual_lote=lote_data['cantidad'],
                        coste_unitario_lote_usd=lote_data['costo_unitario_usd'],
                        detalle_oc=detalle_oc
                    )
            
            # Actualizar cantidad recibida en detalle de OC
            detalle_oc.cantidad_recibida = nueva_cantidad_recibida
            detalle_oc.save()
        
        # Actualizar totales de la compra
        compra.monto_recepcion_usd = total_recepcion_usd
        compra.monto_recepcion_ves = total_recepcion_usd * compra.tasa_cambio_aplicada
        compra.monto_pendiente_pago_usd = total_recepcion_usd
        compra.save()
        
        # Actualizar estado de la OC
        self._actualizar_estado_oc(orden_compra)
        
        return Response(
            CompraDetailSerializer(compra).data,
            status=status.HTTP_201_CREATED
        )
    
    def _actualizar_estado_oc(self, orden_compra):
        """Actualiza el estado de la OC según lo recibido"""
        detalles = orden_compra.detalleordenescompra_set.all()
        
        todo_recibido = all(
            d.cantidad_recibida >= d.cantidad_solicitada for d in detalles
        )
        algo_recibido = any(d.cantidad_recibida > 0 for d in detalles)
        
        if todo_recibido:
            estado = EstadosOrdenCompra.objects.get(nombre_estado='Recibida Completa')
            orden_compra.fecha_entrega_real = datetime.now().date()
        elif algo_recibido:
            estado = EstadosOrdenCompra.objects.get(nombre_estado='Recibida Parcial')
        else:
            return
        
        orden_compra.estado_oc = estado
        orden_compra.save()
```

### 3. PagosProveedoresViewSet

```python
class PagosProveedoresViewSet(viewsets.ModelViewSet):
    queryset = PagosProveedores.objects.all().select_related('proveedor', 'metodo_pago', 'compra_asociada')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return PagoProveedorCreateSerializer
        return PagoProveedorDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        proveedor = self.request.query_params.get('proveedor', None)
        compra = self.request.query_params.get('compra', None)
        
        if proveedor:
            queryset = queryset.filter(proveedor_id=proveedor)
        if compra:
            queryset = queryset.filter(compra_asociada_id=compra)
        
        return queryset.order_by('-fecha_pago')
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Registra un pago y actualiza el monto pendiente de la compra"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        pago = serializer.save()
        
        # Actualizar monto pendiente de la compra
        if pago.compra_asociada:
            compra = pago.compra_asociada
            compra.monto_pendiente_pago_usd -= pago.monto_pago_usd
            
            if compra.monto_pendiente_pago_usd <= 0:
                compra.monto_pendiente_pago_usd = 0
                compra.pagado = True
            
            compra.save()
        
        return Response(
            PagoProveedorDetailSerializer(pago).data,
            status=status.HTTP_201_CREATED
        )
```

---

## 🔗 URLs y Endpoints

```python
# backend/djangobackend/apps/compras/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    ProveedoresViewSet,
    OrdenesCompraViewSet,
    ComprasViewSet,
    PagosProveedoresViewSet
)

router = DefaultRouter()
router.register(r'proveedores', ProveedoresViewSet, basename='proveedores')
router.register(r'ordenes-compra', OrdenesCompraViewSet, basename='ordenes-compra')
router.register(r'compras', ComprasViewSet, basename='compras')
router.register(r'pagos-proveedores', PagosProveedoresViewSet, basename='pagos-proveedores')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Endpoints Disponibles:

#### OrdenesCompra
- `GET /api/compras/ordenes-compra/` - Listar OCs
- `POST /api/compras/ordenes-compra/` - Crear OC
- `GET /api/compras/ordenes-compra/{id}/` - Detalle de OC
- `PUT /api/compras/ordenes-compra/{id}/` - Actualizar OC
- `DELETE /api/compras/ordenes-compra/{id}/` - Eliminar OC
- `POST /api/compras/ordenes-compra/{id}/marcar_enviada/` - Marcar como enviada
- `POST /api/compras/ordenes-compra/{id}/enviar_email/` - Enviar por email
- `GET /api/compras/ordenes-compra/{id}/generar_pdf/` - Generar PDF
- `POST /api/compras/ordenes-compra/{id}/cancelar/` - Cancelar OC

#### Compras (Recepciones)
- `GET /api/compras/compras/` - Listar recepciones
- `POST /api/compras/compras/` - Crear recepción
- `GET /api/compras/compras/{id}/` - Detalle de recepción

#### Pagos
- `GET /api/compras/pagos-proveedores/` - Listar pagos
- `POST /api/compras/pagos-proveedores/` - Registrar pago
- `GET /api/compras/pagos-proveedores/{id}/` - Detalle de pago

---

## 👉 Continúa en `04_FRONTEND_UI.md`
