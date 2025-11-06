import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

export const ComprasFormSelect = ({
  id,
  value,
  onChange,
  children,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) => {
  return (
    <>
      <Select value={value} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className="cursor-pointer w-full bg-gray-50" id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-(--z-index-over-header-bar)">
          {children}
        </SelectContent>
      </Select>
    </>
  );
};
