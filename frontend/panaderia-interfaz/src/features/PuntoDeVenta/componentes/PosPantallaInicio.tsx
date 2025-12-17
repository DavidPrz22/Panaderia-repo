import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CardContent } from "@mui/material"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Minus, Store, Lock, ArrowRight } from "lucide-react"
import { usePOSContext } from "@/context/POSContext"
import { useAuth } from "@/context/AuthContext"
import { userHasPermission } from "@/features/Authentication/lib/utils"
import { useIsActiveCajaQuery, useBCVRateQuery } from "../hooks/queries/queries"
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner"
import { useReducer } from "react"
import { aperturaCajaSchema, type TAperturaCaja } from "../schemas/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAperturaCajaMutation } from "../hooks/mutations/mutations"

type MontosForm = {
  monto_inicial_usd: number,
  monto_inicial_ves: number
}

type Action = {
  type: 'Update',
  payload: string
}
export const PosApertura = () => {

  const { data: { promedio } = { promedio: 0 } } = useBCVRateQuery();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TAperturaCaja>({
    resolver: zodResolver(aperturaCajaSchema),
    defaultValues: {
      monto_inicial_usd: 0,
      monto_inicial_ves: 0,
      notas_apertura: "",
    },
  })
  const { setOpenPOS } = usePOSContext();

  const [cantidad, setCantidad] = useReducer((state: MontosForm, action: Action) => {
    
    if (action.type === 'Update') {
      const monto_inicial_usd = Number(action.payload)
      const monto_inicial_ves = Math.round((monto_inicial_usd * promedio) * 100) / 100

      setValue('monto_inicial_usd', monto_inicial_usd)
      setValue('monto_inicial_ves', monto_inicial_ves)
      return {
        monto_inicial_usd: monto_inicial_usd,
        monto_inicial_ves: monto_inicial_ves,

      }
    }
    return state;
  },
    {
      monto_inicial_usd: 0.00,
      monto_inicial_ves: 0.00,
    });

  const { mutateAsync: abrirCaja, isPending: isCajaPending } = useAperturaCajaMutation()


  const handleSumbitApertura = async (data: TAperturaCaja) => {
    const res = await abrirCaja(data)
    setOpenPOS(false)
  }


  return (
    <>
      <div className="h-full flex items-center justify-center bg-background/95 animate-in zoom-in-95 duration-300">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Apertura de Caja</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpenPOS(false)}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Ingresa el monto inicial para comenzar el turno.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(handleSumbitApertura)}>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto Inicial en Caja ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={cantidad.monto_inicial_usd.toFixed(2)}
                    min={0}
                    step="0.01"
                    className="pl-7 text-lg font-medium h-11 focus-visible:ring-blue-200"
                    required
                    onKeyDown={(e) => {
                      if (["-", "e"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => setCantidad({ type: 'Update', payload: e.target.value })}
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Observaciones iniciales..."
                  className="resize-none min-h-[100px] focus-visible:ring-blue-200"
                  {...register('notas_apertura')}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-semibold bg-blue-900 hover:bg-blue-800 cursor-pointer"
                disabled={isCajaPending}
              >
                {isCajaPending ? "Abriendo Caja..." : "Confirmar Apertura"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

const CloseMessage = () => {
  return (
    <div className="font-semibold font-[Roboto] underline">
      Consulta con tu gerente sobre el estado de la caja
    </div>
  )
}

export const PosCerrado = () => {
  const { user } = useAuth();
  const { setOpenPOS } = usePOSContext();
  const hasPermission = userHasPermission(user!, 'punto_venta', 'add');
  return (
    <div className="h-full flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Caja Cerrada</h2>
          <p className="text-muted-foreground">La sesión de ventas actual está cerrada. Debes abrir la caja para comenzar a registrar transacciones.</p>
        </div>

        {hasPermission ? (
          <Button
            size="lg"
            className="w-full text-lg h-12 shadow-lg shadow-primary/20 font-semibold bg-blue-900 hover:bg-blue-800 cursor-pointer"
            onClick={() => { setOpenPOS(true) }}
          >
            <Store className="mr-2 h-5 w-5" />
            Abrir Caja
          </Button>
        ) :
          <CloseMessage />
        }
      </div>
    </div>
  )
}


const AperturaCaja = () => {
  const { openPOS } = usePOSContext();
  return (
    openPOS ? <PosApertura /> : <PosCerrado />
  )
}

export const PaginaInicio = () => {
  const { data: { is_active } = { is_active: false }, isFetching } = useIsActiveCajaQuery();

  return (
    <>
      {
        isFetching ? <PendingTubeSpinner extraClass="h-full" size={40} /> :

          is_active ? <div>Hola</div> : <AperturaCaja />
      }
    </>
  )
}