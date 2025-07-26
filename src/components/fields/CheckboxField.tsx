/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Control } from "react-hook-form";

interface CheckboxFieldProps {
  name: string;
  label?: string;
  classNameInput?: string;
  className?: string;
  control: Control<any>;
}

const CheckboxField = ({
  name,
  label,
  control,
  classNameInput = "",
  className = "",
}: CheckboxFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="py-5">
          <FormItem className={`flex items-center space-x-2 ${className}`}>
            <FormControl>
              <Checkbox
                id="tyc"
                className={`cursor-pointer ${classNameInput}`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            {label && (
              <FormLabel
                htmlFor="tyc"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {label}
              </FormLabel>
            )}
          </FormItem>
          <FormMessage className="text-[12px]" />
        </div>
      )}
    />
  );
};

export default CheckboxField;
