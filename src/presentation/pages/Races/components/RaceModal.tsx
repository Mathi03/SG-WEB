import InputField from "@components/fields/InputField";
import { Modal } from "@components/misc/Modal";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import {
  raceSchema,
  RaceSchema,
} from "@infrastructure/validations/raceValidation";
import { useRequest } from "ahooks";
import RaceController from "@infrastructure/controllers/RaceController";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RaceModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: RaceSchema | null;
  onAction?: () => void;
}

const RaceModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: RaceModalProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<RaceSchema>({
    resolver: zodResolver(raceSchema),
    mode: "onChange",
    defaultValues: {
      id: data?.id || undefined,
      name: data ? data.name : "",
    },
  });

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (race) => RaceController.create(race),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Raza creada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );
  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (race) => RaceController.update(data?.id ?? 0, race),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Raza actualizada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: RaceSchema) => {
    if (action === "add") {
      runCreate(data);
    } else {
      runUpdate(data);
    }
  };

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Raza`}
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      <div className="flex h-full w-full flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField control={form.control} name="name" label="Nombre" />
            <div className="flex items-center justify-end gap-3 w-full mt-2">
              <Button type="submit" disabled={loadingCreate || loadingUpdate}>
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

export default RaceModal;
