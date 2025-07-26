import InputField from "@components/fields/InputField";
import { Modal } from "@components/misc/Modal";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePickerField from "@components/fields/DatePickerField";
import { Button } from "@components/ui/button";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";
import {
  geneticSchema,
  GeneticsSchema,
} from "@infrastructure/validations/geneticsValidation";
import GeneticsController from "@infrastructure/controllers/GeneticsController";
import { format } from "date-fns";
import { toast } from "sonner";

interface WeighingModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: GeneticsSchema | null;
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

  const form = useForm<GeneticsSchema>({
    resolver: zodResolver(geneticSchema),
    mode: "onChange",
    defaultValues: {
      farmId: currentFarm?.id ?? 0,
      uniqueCode: data?.uniqueCode || "",
      purchaseDate: data?.purchaseDate
        ? new Date(data.purchaseDate)
        : new Date(),
      purchasePrice: data?.purchasePrice || 0,
      stock: data?.stock || 0,
    },
  });

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (genetics) => GeneticsController.create(genetics),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Pajilla de semen creada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (genetics) => GeneticsController.update(data?.id ?? 0, genetics),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Pajilla de semen actualizada exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: GeneticsSchema) => {
    if (action === "add") {
      runCreate({
        ...data,
        purchaseDate: format(data.purchaseDate, "yyyy-MM-dd"),
      });
    } else {
      const sendData = {
        pucharsePrice: data.purchasePrice,
        pucharseDate: format(data.purchaseDate, "yyyy-MM-dd"),
        stock: data.stock,
      };
      runUpdate(sendData);
    }
  };

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Pajilla de Semen`}
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      <div className="flex h-full w-full flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              control={form.control}
              name="uniqueCode"
              label="Codigo"
              disabled={action === "edit"}
            />
            <DatePickerField
              control={form.control}
              name="purchaseDate"
              label="Fecha"
            />
            <div className="flex gap-4">
              <InputField
                className="w-[50%]"
                control={form.control}
                name="purchasePrice"
                label="Precio de Compra"
                type="number"
              />
              <InputField
                className="w-[50%]"
                control={form.control}
                name="stock"
                label="Stock"
                type="number"
              />
            </div>
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
