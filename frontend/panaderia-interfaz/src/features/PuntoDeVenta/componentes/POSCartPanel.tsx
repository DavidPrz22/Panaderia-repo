import { POSCartPanelClientSelect } from "./POSCartPanelClientSelect";
import { POSCartPanelCartItems } from "./POSCartPanelCartItems";
import { POSCartItemPanelTotals } from "./POSCartItemPanelTotals";
import type { WatchSetValue } from "../types/types";

export const POSCartPanel = ({watch, setValue}: WatchSetValue) => {

    const handleSetCliente = (clienteId: number) => {
      if ( setValue) setValue('cliente', clienteId)
    }

    const handleSetTotals = (total_usd: number, tasa_cambio: number) => {
      if ( setValue ) {
        setValue('monto_total_usd', total_usd);
        setValue('monto_total_ves', Math.round((total_usd * tasa_cambio) * 100 ) / 100)
        setValue('tasa_cambio_aplicada', tasa_cambio)
      }
    }
    return (
        <div className="flex w-80 flex-col border-r border-border bg-card">
          {/* Client selector */}
          <POSCartPanelClientSelect onSetCliente={handleSetCliente}/>

          {/* Cart items */}
          <POSCartPanelCartItems watch={watch} setValue={setValue}/>

          {/* Total and actions */}
          <POSCartItemPanelTotals onSetTotals={handleSetTotals}/>
        </div>
    )
}