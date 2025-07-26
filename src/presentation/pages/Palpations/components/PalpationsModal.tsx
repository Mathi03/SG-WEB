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
  PalpationsSchema,
  palpationsSchema,
} from "@infrastructure/validations/palpationsValidation";

import { useRequest } from "ahooks";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import PalpationsController from "@infrastructure/controllers/PalpationsController";
import { format } from "date-fns";

interface PalpationsModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: PalpationsSchema | null;
  onAction?: () => void;
}

const PalpationsModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: PalpationsModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<PalpationsSchema>({
    resolver: zodResolver(palpationsSchema),
    mode: "onChange",
    defaultValues: {
      farmId: currentFarm?.id ?? 0,
      tagNumber: data?.tagNumber ?? "",
      animalId: data?.animalId ?? 0,
      animalName: data?.animalName ?? "",
      result: data?.result ?? "pregnant",
      performedBy: data?.performedBy ?? "",
      date: data?.date ? new Date(data.date) : new Date(),
      comments: data?.comments ?? "",
    },
  });

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (palpation) => PalpationsController.create(palpation),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Palpación creada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (palpation) => PalpationsController.update(data?.id ?? 0, palpation),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Palpación actualizada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: PalpationsSchema) => {
    if (action === "add") {
      runCreate(data);
    } else {
      const sendData = {
        date: format(data.date, "yyyy-MM-dd"),
        result: data.result,
        performedBy: data.performedBy,
        comments: data.comments,
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
              filterStatus="in_service"
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
                name="result"
                label="Resultado"
                data={[
                  { label: "Preñada", value: "pregnant" },
                  { label: "No Preñada", value: "not_pregnant" },
                ]}
              />

              <InputField
                className="w-[50%]"
                control={form.control}
                name="performedBy"
                label="Veterinario"
                type="text"
              />
            </div>
            <DatePickerField control={form.control} name="date" label="Fecha" />
            <TextAreaField
              control={form.control}
              name="comments"
              label="Notas"
            />

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

export default PalpationsModal;
