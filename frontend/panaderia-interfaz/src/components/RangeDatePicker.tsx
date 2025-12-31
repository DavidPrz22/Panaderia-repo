import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker"
import { es } from "date-fns/locale"

export const RangeDatePicker = ({ selected, onSelect }: { selected: DateRange | undefined, onSelect: (selected: DateRange | undefined) => void }) => {

    return (
        <Calendar
            mode="range"
            selected={selected}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={es}
        />
    )
}