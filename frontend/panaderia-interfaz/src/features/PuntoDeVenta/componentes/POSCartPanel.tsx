import { POSCartPanelClientSelect } from "./POSCartPanelClientSelect";
import { POSCartPanelCartItems } from "./POSCartPanelCartItems";
import { POSCartItemPanelTotals } from "./POSCartItemPanelTotals";


export const POSCartPanel = () => {
    
    return (
        <div className="flex w-80 flex-col border-r border-border bg-card">
          {/* Client selector */}
          <POSCartPanelClientSelect />

          {/* Cart items */}
          <POSCartPanelCartItems />

          {/* Total and actions */}
          <POSCartItemPanelTotals />
        </div>
    )
}