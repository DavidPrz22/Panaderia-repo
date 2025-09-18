import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { watchSetvalueTypeProduction } from "../types/types";
import dayjs from "dayjs";
import "dayjs/locale/es";

export const ProductDateInput = ({ setValue }: watchSetvalueTypeProduction) => {
  dayjs.locale("es");
  
  // Get today's date at start of day for comparison
  const today = dayjs().startOf("day");
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DatePicker
        className="w-full"
        minDate={today}
        slotProps={{
          textField: {
            sx: {
              borderRadius: "0.375rem",
              "&.Mui-focused": {
                outline: "none",
                boxShadow: "0 0 0 3px #dbeafe",
              },
              transition: "box-shadow 300ms ease-in-out",
            }
          },
        }}
        onChange={(date) => {
          if (!date) return;
          
          if (date.isBefore(today)) {
            return; 
          }

          const value = date.format("YYYY-MM-DD");
          if (setValue) {
            setValue("fechaExpiracion", value);
          }
        }}
      />
    </LocalizationProvider>
  );
};
