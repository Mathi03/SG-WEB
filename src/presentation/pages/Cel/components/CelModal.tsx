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
import {
  celSchema,
  CelSchema,
} from "@infrastructure/validations/celValidation";
import { useRequest } from "ahooks";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import CelController from "@infrastructure/controllers/CelController";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CelModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: CelSchema | null;
  onAction?: () => void;
}

const CelModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: CelModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<CelSchema>({
    resolver: zodResolver(celSchema),
    mode: "onChange",
    defaultValues: {
      animalId: data?.animalId || 0,
      tagNumber: data?.tagNumber || "",
      animalName: data?.animalName || "",
      dateObserved: data?.dateObserved
        ? new Date(data.dateObserved)
        : new Date(),
      observedBy: data?.observedBy || "",
      symptoms: data?.symptoms || "",
      farmId: currentFarm?.id ?? 0,
    },
  });

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (cel) => CelController.create(cel),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Celo creado exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (cel) => CelController.update(data?.id ?? 0, cel),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Celo actualizado exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: CelSchema) => {
    if (action === "add") {
      runCreate({
        ...data,
        dateObserved: format(data.dateObserved, "yyyy-MM-dd"),
      });
    } else {
      const sendData = {
        dateObserved: format(data.dateObserved, "yyyy-MM-dd"),
        observedBy: data.observedBy,
        symptoms: data.symptoms,
      };
      runUpdate(sendData);
    }
  };

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Celo`}
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
              <DatePickerField
                className="w-[50%]"
                control={form.control}
                name="dateObserved"
                label="Fecha de Observación"
              />
              <InputField
                className="w-[50%]"
                control={form.control}
                name="observedBy"
                label="Observado Por"
              />
            </div>

            <TextAreaField
              control={form.control}
              name="symptoms"
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

export default CelModal;
