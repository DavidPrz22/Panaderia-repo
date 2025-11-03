import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { DetalleOC, EstadosOC, OrdenCompra } from "../types/types";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badge: {
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '25%',
    marginBottom: 10,
    paddingRight: 10,
  },
  infoLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 9,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    color: '#374151',
  },
  // Column widths
  colProducto: { width: '20%' },
  colCantidad: { width: '12%', textAlign: 'center' },
  colUnidad: { width: '12%', textAlign: 'center' },
  colPrecio: { width: '14%', textAlign: 'right' },
  colImpuesto: { width: '10%', textAlign: 'center' },
  colDescuento: { width: '12%', textAlign: 'right' },
  colSubtotal: { width: '10%', textAlign: 'right' },
  colTotal: { width: '10%', textAlign: 'right' },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalsColumn: {
    width: '200px',
    marginLeft: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  notesSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  notesText: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
});

export const OrdenCompraPDF = ({ ordenCompra }: { ordenCompra: OrdenCompra }) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Orden de Compra #{ordenCompra.id}</Text>
          <View style={styles.badge}>
            <Text>{ordenCompra.estado_oc ? ordenCompra.estado_oc.nombre_estado as EstadosOC : 'Borrador'}</Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Proveedor</Text>
            <Text style={styles.infoValue}>{ordenCompra.proveedor.nombre_proveedor}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fecha de Orden</Text>
            <Text style={styles.infoValue}>{formatDate(ordenCompra.fecha_emision_oc)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Método de Pago</Text>
            <Text style={styles.infoValue}>{ordenCompra.metodo_pago.nombre_metodo}</Text>
          </View>
          {ordenCompra.direccion_envio && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Dirección de Envío</Text>
              <Text style={styles.infoValue}>{ordenCompra.direccion_envio}</Text>
            </View>
          )}
          {ordenCompra.terminos_pago && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Términos de Pago</Text>
              <Text style={styles.infoValue}>{ordenCompra.terminos_pago}</Text>
            </View>
          )}
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Proveedor</Text>
          <View style={styles.infoGrid}>
            {ordenCompra.proveedor.email_contacto && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{ordenCompra.proveedor.email_contacto}</Text>
              </View>
            )}
            {ordenCompra.proveedor.telefono_contacto && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{ordenCompra.proveedor.telefono_contacto}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Product Lines Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Líneas de Productos</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, styles.colProducto]}>Producto</Text>
              <Text style={[styles.tableCellHeader, styles.colCantidad]}>Cantidad Solicitada</Text>
              <Text style={[styles.tableCellHeader, styles.colUnidad]}>Unidad de Medida</Text>
              <Text style={[styles.tableCellHeader, styles.colPrecio]}>Precio Unitario</Text>
              <Text style={[styles.tableCellHeader, styles.colImpuesto]}>Impuesto</Text>
              <Text style={[styles.tableCellHeader, styles.colDescuento]}>Descuento</Text>
              <Text style={[styles.tableCellHeader, styles.colSubtotal]}>Subtotal</Text>
              <Text style={[styles.tableCellHeader, styles.colTotal]}>Total</Text>
            </View>
            
            {/* Table Body */}
            {ordenCompra.detalles.map((item: DetalleOC, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colProducto]}>
                  {item.producto_reventa_nombre || item.materia_prima_nombre}
                </Text>
                <Text style={[styles.tableCell, styles.colCantidad]}>
                  {item.cantidad_solicitada}
                </Text>
                <Text style={[styles.tableCell, styles.colUnidad]}>
                  {item.unidad_medida_abrev}
                </Text>
                <Text style={[styles.tableCell, styles.colPrecio]}>
                  {formatCurrency(item.costo_unitario_usd)}
                </Text>
                <Text style={[styles.tableCell, styles.colSubtotal]}>
                  {formatCurrency(item.subtotal_linea_usd)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsColumn}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tasa de Cambio:</Text>
              <Text style={styles.totalValue}>{ordenCompra.tasa_cambio_aplicada}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total en VES:</Text>
              <Text style={styles.totalValue}>{ordenCompra.monto_total_oc_ves}</Text>
            </View>
          </View>
          
          <View style={styles.totalsColumn}>
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(ordenCompra.monto_total_oc_usd)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {ordenCompra.notas && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notesText}>{ordenCompra.notas}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};