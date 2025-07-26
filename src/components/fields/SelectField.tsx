/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Control } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface SelectFieldProps {
  name: string;
  label?: string;
  classNameInput?: string;
  className?: string;
  control: Control<any>;
  data?: { value: string; label: string }[];
  disabled?: boolean;
}

const SelectField = ({
  name,
  label,
  control,
  classNameInput = "",
  className = "",
  data = [],
  disabled = false,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <div>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className={`w-full ${classNameInput}`}>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem
                    key={`${item.value}-${uuidv4()}`}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[12px]" />{" "}
          </div>
        </FormItem>
      )}
    />
  );
};

export default SelectField;
