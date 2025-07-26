/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { Control } from "react-hook-form";

interface TextAreaFieldProps {
  name: string;
  label?: string;
  classNameInput?: string;
  className?: string;
  control: Control<any>;
  disabled?: boolean;
  rows?: number;
}

const TextAreaField = ({
  name,
  label,
  control,
  classNameInput = "",
  className = "",
  disabled = false,
  rows = 3,
}: TextAreaFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <div>
            <FormControl>
              <Textarea
                {...field}
                className={classNameInput}
                ref={field.ref}
                disabled={disabled}
                rows={rows}
              />
            </FormControl>
            <FormMessage className="text-[12px]" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TextAreaField;
