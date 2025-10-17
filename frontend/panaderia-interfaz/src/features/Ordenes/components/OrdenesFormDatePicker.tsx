import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export const OrdenesFormDatePicker = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => {
  const parsedValue = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  return (
    <div className="space-y-2">
                <Label>{label} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal cursor-pointer bg-gray-50",
                        !value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {parsedValue ? format(parsedValue, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-(--z-index-over-header-bar)" align="start">
                    <Calendar
                      mode="single"
                      selected={parsedValue ? parsedValue : undefined}
                      onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
  )
}