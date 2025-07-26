import InputField from "@components/fields/InputField";
import { Modal } from "@components/misc/Modal";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePickerField from "@components/fields/DatePickerField";
import SelectField from "@components/fields/SelectField";
import { Button } from "@components/ui/button";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import SelectAnimalField from "@components/fields/SelectAnimalField";
import TextAreaField from "@components/fields/TextAreaField";
import {
  milkProductionSchema,
  MilkProductionSchema,
} from "@infrastructure/validations/milkProductionValidation";
import MilkProductionController from "@infrastructure/controllers/MilkProductionController";
import { useRequest } from "ahooks";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MilkProductionModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: MilkProductionSchema | null;
  onAction?: () => void;
}

const MilkProductionModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: MilkProductionModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<MilkProductionSchema>({
    resolver: zodResolver(milkProductionSchema),
    mode: "onChange",
    defaultValues: {
      animalId: data?.animalId || 0,
      tagNumber: data?.tagNumber || "",
      animalName: data?.animalName || "",
      shift: data?.shift || "morning",
      amount: data?.amount || 0,
      milkedAt: data?.milkedAt ? new Date(data.milkedAt) : new Date(),
      notes: data?.notes || "",
    },
  });

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (milkProduction) => MilkProductionController.create(milkProduction),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Producción de leche creada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (milkProduction) =>
      MilkProductionController.update(data?.id ?? 0, milkProduction),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Producción de leche actualizada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: MilkProductionSchema) => {
    if (action === "add") {
      runCreate({ ...data, farmId: currentFarm?.id ?? 0 });
    } else {
      const sendData = {
        shift: data.shift,
        milkedAt: data.milkedAt,
        amount: data.amount,
        notes: data.notes,
      };
      runUpdate(sendData);
    }
  };

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Producción de Leche`}
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      <div className="flex h-full w-full flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SelectAnimalField
              control={form.control}
              name="tagNumber"
              label="Nro. Arete"
              onChange={(data) => {
                form.setValue("animalId", data.id);
                form.setValue("tagNumber", data.tagNumber);
                form.setValue("animalName", data.name);
              }}
              disabled={action === "edit"}
            />
            <InputField
              control={form.control}
              name="animalName"
              label="Nombre"
              disabled
            />
            <div className="flex gap-4">
              <SelectField
                className="w-[50%]"
                control={form.control}
                name="shift"
                label="Turno"
                data={[
                  { label: "Mañana", value: "morning" },
                  { label: "Tarde", value: "afternoon" },
                  { label: "Noche", value: "night" },
                ]}
              />

              <InputField
                className="w-[50%]"
                control={form.control}
                name="amount"
                label="Cantidad"
                type="number"
              />
            </div>
            <DatePickerField
              control={form.control}
              name="milkedAt"
              label="Fecha"
            />
            <TextAreaField control={form.control} name="notes" label="Notas" />

            <div className="flex items-center justify-end gap-3 w-full mt-2">
              <Button disabled={loadingCreate || loadingUpdate} type="submit">
                {(loadingCreate || loadingUpdate) && (
                  <Loader2 className="animate-spin" />
                )}
                Guardar
              </Button>
              {action === "edit" && (
                <Button
                  disabled={loadingCreate || loadingUpdate}
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                >
                  Eliminar
                </Button>
              )}
              <div className="grow" />
              <Button
                disabled={loadingCreate || loadingUpdate}
                variant="secondary"
                onClick={() => {
                  onClose(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {showDeleteModal && (
        <DeleteModal
          onClose={(e: boolean) => {
            setShowDeleteModal(e);
          }}
          onAction={() => {
            onAction();
            onClose(false);
          }}
          id={data?.id ?? 0}
        />
      )}
    </Modal>
  );
};

export default MilkProductionModal;
