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

interface PasswordFieldProps {
  name: string;
  label?: string;
  classNameInput?: string;
  className?: string;
  control: Control<any>;
}

const PasswordField = ({
  name,
  label,
  control,
  classNameInput = "",
  className = "",
}: PasswordFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <div>
            <FormControl>
              <Input type="password" className={classNameInput} {...field} />
            </FormControl>
            <FormMessage className="text-[12px]" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
