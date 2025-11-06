import { useState } from "react"
import { Plus, Package, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DetalleOC, OrdenCompra } from "../types/types"
import { CalendarClock as CalendarIcon } from "lucide-react"
import { ComprasFormDatePicker } from "./ComprasFormDatePicker"
import type { ComponentesUIRecepcion } from "../types/types"
import { RecepcionFormSchema, type TRecepcionFormSchema } from "../schemas/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function ComprasRecepcion({ ordenCompra, onClose }: { ordenCompra: OrdenCompra, onClose: () => void }) {
  
  const { handleSubmit, watch, setValue } = useForm<TRecepcionFormSchema>({
    
    resolver: zodResolver(RecepcionFormSchema),
    defaultValues: {
      orden_compra_id: ordenCompra.id,
      detalles: ordenCompra.detalles.map((detalle) => ({
        detalle_oc_id: detalle.id,
        lotes: [{ id: "1", cantidad: 0, fecha_caducidad: "" }],
      })),
    },
  })

  const [receptions, setReceptions] = useState<ComponentesUIRecepcion[]>(
    ordenCompra.detalles.map((line) => ({
      linea_oc: line,
      lotes: [{ id: "1", cantidad: 0, fecha_caducidad: "" }],
      cantidad_total_recibida: line.cantidad_solicitada,
    })),
  )

  const handleAddLot = (lineId: number) => {
    setReceptions((prev) =>
      prev.map((reception) => {
        if (reception.linea_oc.id === lineId) {
          const newLotNumber = (Math.max(...reception.lotes.map((l) => Number(l.id)), 0) + 1).toString()
          return {
            ...reception,
            lotes: [...reception.lotes, { id: newLotNumber, cantidad: 0, fecha_caducidad: "" }],
          }
        }
        return reception
      }),
    )
  }

  const handleRemoveLot = (lineId: number, lotId: string) => {
    setReceptions((prev) =>
      prev.map((reception) => {
        if (reception.linea_oc.id === lineId) {
          const updatedLots = reception.lotes.filter((lot) => lot.id !== lotId)
          return {
            ...reception,
            lotes: updatedLots.length > 0 ? updatedLots : [{ id: "1", cantidad: 0, fecha_caducidad: "" }],
            cantidad_total_recibida: updatedLots.reduce((sum, lot) => sum + (Number(lot.cantidad) || 0), 0),
          }
        }
        return reception
      }),
    )
  }

  const handleLotChange = (lineId: number, lotId: string, field: "cantidad" | "fecha_caducidad", value: string | number) => {
    setReceptions((prev) =>
      prev.map((reception) => {
        if (reception.linea_oc.id === lineId) {
          const updatedLots = reception.lotes.map((lot) => {
            if (lot.id === lotId) {
              return { ...lot, [field]: value }
            }
            return lot
          })
          return {
            ...reception,
            lots: updatedLots,
            cantidad_total_recibida: updatedLots.reduce((sum, lot) => sum + (Number(lot.cantidad) || 0), 0),
          }
        }
        return reception
      }),
    )
  }

  const getReceivedBadgeColor = (cantidad_total_recibida: number, ordered: number) => {
    if (cantidad_total_recibida === 0) return "bg-gray-100 text-gray-700"
    if (cantidad_total_recibida >= ordered) return "bg-green-100 text-green-700"
    return "bg-orange-100 text-orange-700"
  }

  const getTotalAllReceptions = () => {
    return receptions.reduce((sum, r) => sum + r.cantidad_total_recibida, 0)
  }

  const getProductDisplayName = (line: DetalleOC) => {
    if (line.materia_prima_nombre) {
      return `${line.materia_prima_nombre} (${line.unidad_medida_abrev})`
    }
    if (line.producto_reventa_nombre) {
      return `${line.producto_reventa_nombre} (${line.unidad_medida_abrev})`
    }
    return "Producto desconocido"
  }

  const handleSubmitReception = (data: TRecepcionFormSchema) => {
    console.log(data)
  }

  return (
    <div className="mx-8 py-5">
    <form onSubmit={handleSubmit(handleSubmitReception)}>
    <div className="text-card-foreground flex flex-col border bg-white shadow-sm rounded-lg">
      <div className="border-b px-6 py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Mercancías a Recepcionar #{ordenCompra.id}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onClose()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      
        <div className="m-6 border border-gray-300 rounded-t-lg" >
          {/* Header */}
          <div className="grid grid-cols-4 gap-6 border-b bg-gray-50 px-6 py-3 text-sm uppercase font-semibold tracking-wider text-gray-500 rounded-t-lg">
            <div >Producto</div>
            <div className="text-right ">Ordenado</div>
            <div className="text-center ">Recibido</div>
          </div>

          {/* Rows */}
          <div className="divide-y">
            {receptions.map((reception) => (
              <div key={reception.linea_oc.id}>
                {/* Product Row */}
                <div className="grid grid-cols-4 gap-6 border-b px-6 py-4 items-center ">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getProductDisplayName(reception.linea_oc)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{reception.linea_oc.cantidad_solicitada}</p>
                  </div>

                  <div className="text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${getReceivedBadgeColor(reception.cantidad_total_recibida, reception.linea_oc.cantidad_solicitada)}`}
                    >
                      {reception.cantidad_total_recibida}
                    </span>
                  </div>

                  <div />
                </div>

                {/* Lots Section */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="space-y-4">
                    {reception.lotes.map((lot, lotIndex) => (
                      <div key={lot.id} className="space-y-3 rounded-lg bg-white p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-600">Lote {lotIndex + 1}</p>
                          {reception.lotes.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLot(reception.linea_oc.id, lot.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="space-y-2 w-1/2">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Package className="h-4 w-4" />
                              <span>Cantidad</span>
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max={reception.linea_oc.cantidad_solicitada}
                              step="1"
                              defaultValue={lot.cantidad}
                              value={lot.cantidad || ""}
                              onChange={(e) =>
                                handleLotChange(reception.linea_oc.id, lot.id, "cantidad", Number(e.target.value) || 0)
                              }
                              placeholder="Cantidad a recibir..."
                              className="rounded border border-gray-300 px-3 py-2 text-sm focus-visible:ring-blue-200"
                            />
                          </div>

                          <div className="space-y-2 w-1/2">
                            <ComprasFormDatePicker
                              label="Caducidad"
                              value={lot.fecha_caducidad}
                              onChange={(v: string) => handleLotChange(reception.linea_oc.id, lot.id, "fecha_caducidad", v)}
                              icon={<CalendarIcon className="h-4 w-4" />}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddLot(reception.linea_oc.id)}
                      className=" text-blue-600 hover:text-blue-700 hover:bg-blue-100 cursor-pointer"
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

      {/* Footer with summary and save button */}
        <div className="flex justify-between items-end bg-white px-6 pb-4 ">
          <div className="flex items-center justify-between w-70 rounded-lg bg-blue-100 p-3">
              <span className="text-sm font-medium text-blue-900">Total de unidades a recibir:</span>
              <span className="text-lg font-bold text-blue-900">{getTotalAllReceptions()}</span>
          </div>
          <Button
            type="submit"
            className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded p-6.5"
          >
            Guardar Recepción
          </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
