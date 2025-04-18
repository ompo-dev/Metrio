import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectIconOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

type SelectIconProps = {
  options: SelectIconOption[];
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function SelectIcon({
  options,
  defaultValue,
  placeholder = "Selecionar opção",
  onChange,
  className,
}: SelectIconProps) {
  const id = useId();
  return (
    <div className={`*:not-first:mt-2 ${className || ""}`}>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.icon}
              <span className="truncate">{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
