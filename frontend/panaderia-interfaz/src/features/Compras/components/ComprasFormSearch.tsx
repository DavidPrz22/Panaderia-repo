import { useState } from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import type { OrdenProductoSearch } from "../types/types"
// import { useProductosPedidoSearchMutation } from "../hooks/mutations/mutations"

export function ComprasFormSearch({ value, onChange }: { value?: string, onChange: (producto: any) => void }) {
  const [open, setOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
//   const { data: dataProductosPedido, mutate: searchProductosPedido } = useProductosPedidoSearchMutation()
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between overflow-hidden"
        >
          {value
          ? value : "Seleccionar producto..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar producto..." onValueChange={(e: string) => {
            const searchTerm = e.trim()
            if (searchTerm === "") return;
            if (timer) clearTimeout(timer)
            const timerRef = setTimeout(() => {}, 1000)
            setTimer(timerRef)
          }} />
          <CommandList>
            {/* {dataProductosPedido?.productos.length === 0 ? (
              <CommandEmpty className="p-2 text-sm">No se encontraron resultados</CommandEmpty>
            ): 
            <CommandEmpty className="p-2 text-sm">Resultados de busqueda...</CommandEmpty>
            } 
            <CommandGroup>
              {dataProductosPedido?.productos.map((dataValue) => (
                <CommandItem
                  key={dataValue.id}
                  value={dataValue.nombre_producto}
                  onSelect={() => {
                    onChange(dataValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === dataValue.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {dataValue.SKU} - {dataValue.nombre_producto}
                </CommandItem>
              ))} 
            </CommandGroup> */}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}