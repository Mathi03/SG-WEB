import InputField from "@components/fields/InputField";
import { Modal } from "@components/misc/Modal";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePickerField from "@components/fields/DatePickerField";
import { Button } from "@components/ui/button";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import SelectAnimalField from "@components/fields/SelectAnimalField";
import TextAreaField from "@components/fields/TextAreaField";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { useRequest } from "ahooks";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  vaccinesSchema,
  VaccinesSchema,
} from "@infrastructure/validations/vaccinesValidation";
import VaccinesController from "@infrastructure/controllers/VaccinesController";
import { toast } from "sonner";

interface WeighingModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: VaccinesSchema | null;
  onAction?: () => void;
}

const WeighingModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: WeighingModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<VaccinesSchema>({
    resolver: zodResolver(vaccinesSchema),
    mode: "onChange",
    defaultValues: {
      animalId: data?.animalId || 0,
      tagNumber: data?.tagNumber || "",
      animalName: data?.animalName || "",
      vaccinatedAt: data?.vaccinatedAt
        ? new Date(data.vaccinatedAt)
        : new Date(),
      vaccinatedBy: data?.vaccinatedBy || "",
      notes: data?.notes || "",
      farmId: currentFarm?.id || 0,
    },
  });

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (vaccines) => VaccinesController.create(vaccines),
    {
      manual: true,
      onSuccess: () => {
        onAction();
        toast.success("La vacuna ha sido creada.");
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (vaccines) => VaccinesController.update(data?.id ?? 0, vaccines),
    {
      manual: true,
      onSuccess: () => {
        toast.success("La vacuna ha sido actualizada.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: VaccinesSchema) => {
    if (action === "add") {
      runCreate({
        ...data,
        vaccinatedAt: format(data.vaccinatedAt, "yyyy-MM-dd"),
      });
    } else {
      const sendData = {
        vaccinatedBy: data.vaccinatedBy,
        vaccinatedAt: format(data.vaccinatedAt, "yyyy-MM-dd"),
        notes: data.notes,
      };
      runUpdate(sendData);
    }
  };

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Vacuna`}
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

            <DatePickerField
              control={form.control}
              name="vaccinatedAt"
              label="Fecha"
            />
            <InputField
              control={form.control}
              name="vaccinatedBy"
              label="Veterinario"
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

export default WeighingModal;
