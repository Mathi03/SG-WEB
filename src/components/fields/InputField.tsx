/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Control } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label?: string;
  classNameInput?: string;
  className?: string;
  control: Control<any>;
  type?: string;
  disabled?: boolean;
}

const InputField = ({
  name,
  label,
  control,
  classNameInput = "",
  className = "",
  type = "text",
  disabled = false,
}: InputFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <div>
            <FormControl>
              <Input
                {...field}
                type={type}
                className={classNameInput}
                ref={field.ref}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage className="text-[12px]" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default InputField;
