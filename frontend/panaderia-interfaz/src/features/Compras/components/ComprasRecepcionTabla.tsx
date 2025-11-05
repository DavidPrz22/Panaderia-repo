import { useState } from "react"
import { Plus, Package, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { DetalleOC, OrdenCompra } from "../types/types"

interface Lot {
  id: string
  quantity: number
  expiration_date: string
}

interface ProductReception {
  line: DetalleOC
  lots: Lot[]
  totalReceived: number
}

interface ComprasRecepcionProps {
  ordenCompra: OrdenCompra
  onClose: () => void
}

export function ComprasRecepcion({ ordenCompra, onClose }: ComprasRecepcionProps) {
  const [receptions, setReceptions] = useState<ProductReception[]>(
    ordenCompra.detalles.map((line) => ({
      line,
      lots: [{ id: "1", quantity: 0, expiration_date: "" }],
      totalReceived: 0,
    })),
  )

  const handleAddLot = (lineId: number) => {
    setReceptions((prev) =>
      prev.map((reception) => {
        if (reception.line.id === lineId) {
          const newLotNumber = (Math.max(...reception.lots.map((l) => Number(l.id)), 0) + 1).toString()
          return {
            ...reception,
            lots: [...reception.lots, { id: newLotNumber, quantity: 0, expiration_date: "" }],
          }
        }
        return reception
      }),
    )
  }

  const handleRemoveLot = (lineId: number, lotId: string) => {
    setReceptions((prev) =>
      prev.map((reception) => {
        if (reception.line.id === lineId) {
          const updatedLots = reception.lots.filter((lot) => lot.id !== lotId)
          return {
            ...reception,
            lots: updatedLots.length > 0 ? updatedLots : [{ id: "1", quantity: 0, expiration_date: "" }],
            totalReceived: updatedLots.reduce((sum, lot) => sum + (Number(lot.quantity) || 0), 0),
          }
        }
        return reception
      }),
    )
  }

  const handleLotChange = (lineId: number, lotId: string, field: "quantity" | "expiration_date", value: any) => {
    setReceptions((prev) =>
      prev.map((reception) => {
        if (reception.line.id === lineId) {
          const updatedLots = reception.lots.map((lot) => {
            if (lot.id === lotId) {
              return { ...lot, [field]: value }
            }
            return lot
          })
          return {
            ...reception,
            lots: updatedLots,
            totalReceived: updatedLots.reduce((sum, lot) => sum + (Number(lot.quantity) || 0), 0),
          }
        }
        return reception
      }),
    )
  }

  const getReceivedBadgeColor = (totalReceived: number, ordered: number) => {
    if (totalReceived === 0) return "bg-gray-100 text-gray-700"
    if (totalReceived >= ordered) return "bg-green-100 text-green-700"
    return "bg-orange-100 text-orange-700"
  }

  const getTotalAllReceptions = () => {
    return receptions.reduce((sum, r) => sum + r.totalReceived, 0)
  }

  return (
    <div className="p-8 ">

    
    <Card className="rounded-lg border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Mercancías a Recepcionar</h2>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <div className="min-w-full " >
          {/* Header */}
          <div className="grid grid-cols-4 gap-6 border-b bg-gray-50 px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            <div>Producto</div>
            <div className="text-right">Ordenado</div>
            <div className="text-center">Recibido</div>
          </div>

          {/* Rows */}
          <div className="divide-y">
            {receptions.map((reception) => (
              <div key={reception.line.id}>
                {/* Product Row */}
                <div className="grid grid-cols-4 gap-6 border-b px-6 py-4 items-center bg-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{reception.line.materia_prima_nombre}</p>
                      
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{reception.line.cantidad_solicitada}</p>
                  </div>

                  <div className="text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${getReceivedBadgeColor(reception.totalReceived, reception.line.quantity)}`}
                    >
                      {reception.totalReceived}
                    </span>
                  </div>

                  <div />
                </div>

                {/* Lots Section */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="space-y-4">
                    {reception.lots.map((lot, lotIndex) => (
                      <div key={lot.id} className="space-y-3 rounded-lg bg-white p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-600">Lote {lotIndex + 1}</p>
                          {reception.lots.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLot(reception.line.id, lot.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>Cantidad</span>
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max={reception.line.cantidad_solicitada}
                            step="0.01"
                            value={lot.quantity || ""}
                            onChange={(e) =>
                              handleLotChange(reception.line.id, lot.id, "quantity", Number(e.target.value) || 0)
                            }
                            placeholder="02"
                            className="rounded border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📅</span>
                            <span>Caducidad</span>
                          </label>
                          <Input
                            type="text"
                            placeholder="dd / mm / aaaa"
                            value={lot.expiration_date}
                            onChange={(e) =>
                              handleLotChange(reception.line.id, lot.id, "expiration_date", e.target.value)
                            }
                            className="rounded border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddLot(reception.line.id)}
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Lote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with summary and save button */}
      <div className="border-t bg-white px-6 py-4 space-y-4">
        <div className="rounded-lg bg-blue-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Total de unidades a recibir:</span>
            <span className="text-lg font-bold text-blue-900">{getTotalAllReceptions()}</span>
          </div>
        </div>
        <Button
          onClick={() => onClose()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
        >
          Guardar Recepción
        </Button>
      </div>
    </Card>
    </div>
  )
}
