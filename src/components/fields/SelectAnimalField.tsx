/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalAnimal from "@components/misc/ModalAnimal";
import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { cn } from "@lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface SelectAnimalFieldProps {
  name: string;
  label?: string;
  classNameInput?: string;
  className?: string;
  control: Control<any>;
  onChange?: (data: any) => void;
  disabled?: boolean;
  filterStatus?:
    | "in_heat"
    | "in_service"
    | "palpation"
    | "pregnant"
    | "lactation";
  filterGender?: "male" | "female";
}

const SelectAnimalField = ({
  name,
  label,
  control,
  classNameInput = "",
  className = "",
  onChange = () => {},
  disabled = false,
  filterStatus,
  filterGender,
}: SelectAnimalFieldProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-col ${className}`}>
          {label && <FormLabel>{label}</FormLabel>}
          <div>
            <FormControl>
              <Button
                disabled={disabled}
                type="button"
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                  classNameInput
                )}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                {field.value}
                <Search className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
            <FormMessage className="text-[12px]" />
            {showModal && (
              <ModalAnimal
                filterStatus={filterStatus}
                filterGender={filterGender}
                onClose={(e) => {
                  setShowModal(e);
                }}
                onChange={(data) => {
                  field.onChange(data.tagNumber);
                  onChange(data);
                  setShowModal(false);
                }}
              />
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default SelectAnimalField;
