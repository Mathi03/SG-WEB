import InputField from "@components/fields/InputField";
import { Modal } from "@components/misc/Modal";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePickerField from "@components/fields/DatePickerField";
import { Button } from "@components/ui/button";
import DeleteModal from "./DeleteModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";
import {
  serviceSchema,
  ServiceSchema,
} from "@infrastructure/validations/serviceValidation";
import ServiceController from "@infrastructure/controllers/ServiceController";
import SelectAnimalField from "@components/fields/SelectAnimalField";
import SelectField from "@components/fields/SelectField";
import TextAreaField from "@components/fields/TextAreaField";
import TypeServicesController from "@infrastructure/controllers/TypeServicesController";
import SelectGeneticField from "@components/fields/SelectGeneticField";
import { format } from "date-fns";
import { toast } from "sonner";

interface ServicesModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: ServiceSchema | null;
  onAction?: () => void;
}

const ServicesModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: ServicesModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    mode: "onChange",
    defaultValues: {
      farmId: currentFarm?.id ?? 0,
      animalId: data?.animalId ?? 0,
      motherTagNumber: data?.motherTagNumber ?? "",
      motherName: data?.motherName ?? "",
      date: data?.date ? new Date(data.date) : new Date(),
      eventNotes: data?.eventNotes ?? "",
      reproductiveMethodId: data?.reproductiveMethodId ?? 0,
      typeService: data?.typeService ?? "",
      matingMaleId: data?.matingMaleId ?? 0,
      matingTagNumber: data?.matingTagNumber ?? "",
      matingName: data?.matingName ?? "",
      semenBatch: data?.semenBatch ?? "",
      strawsUsed: data?.strawsUsed ?? 1,
      inseminatedBy: data?.inseminatedBy ?? "",
      inseminationNotes: data?.inseminationNotes ?? "",
      matingDetails: data?.matingDetails ?? "",
      performedBy: data?.performedBy ?? "",
      performedNotes: data?.performedNotes ?? "",
      reproductionEventId: data?.reproductionEventId ?? 0,
    },
  });
  console.log(data);

  const reproductiveMethodId = form.watch("reproductiveMethodId");
  const typeService = form.watch("typeService");

  const { data: typeServices, loading: loadingTypeService } = useRequest(
    async () => {
      const response = await TypeServicesController.search({
        farmId: currentFarm?.id ?? 0,
      });
      return (
        response
          .filter((item) => {
            if (
              currentFarm?.serviceSymbol?.includes("IA") &&
              item?.code === "IA"
            ) {
              return true;
            }
            if (
              currentFarm?.serviceSymbol?.includes("MN") &&
              item?.code === "MN"
            ) {
              return true;
            }
          })
          .map((item) => {
            if (item.code === "IA") {
              return {
                label: item.name ?? "",
                value: `${1}`,
              };
            }
            if (item.code === "MN") {
              return {
                label: item.name ?? "",
                value: `${2}`,
              };
            }
            return {
              label: item.name ?? "",
              value: `${item.id ?? 0}`,
            };
          }) ?? []
      );
    }
  );

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (services) => ServiceController.create(services),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Servicio creado exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (services) =>
      ServiceController.update(data?.reproductionEventId ?? 0, services),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Servicio actualizado exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: ServiceSchema) => {
    if (action === "add") {
      runCreate({
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      });
    } else {
      runUpdate({
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      });
    }
  };

  useEffect(() => {
    if (!reproductiveMethodId) return;
    const findService = typeServices?.find(
      (item) => item?.value === `${reproductiveMethodId}`
    );
    console.log("findService", findService);

    switch (findService?.label?.toLowerCase()) {
      case "inseminacion artificial":
        form.setValue("typeService", "IA");
        break;
      case "monta natural":
        form.setValue("typeService", "MN");
        break;
      case "transferencia de embriones":
        form.setValue("typeService", "ET");
        break;
      default:
        break;
    }
  }, [reproductiveMethodId, form, typeServices]);

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Servicio`}
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      {loadingTypeService ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex h-full w-full flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <SelectAnimalField
                  control={form.control}
                  name="motherTagNumber"
                  label="Nro. Arete"
                  onChange={(data) => {
                    form.setValue("animalId", data.id);
                    form.setValue("motherTagNumber", data.tagNumber);
                    form.setValue("motherName", data.name);
                  }}
                  disabled={action === "edit"}
                  filterStatus="in_heat"
                />
                <InputField
                  control={form.control}
                  name="motherName"
                  label="Nombre"
                  disabled
                />

                <DatePickerField
                  control={form.control}
                  name="date"
                  label="Fecha"
                />
                <TextAreaField
                  control={form.control}
                  name="eventNotes"
                  label="Notas del Evento"
                />
                <SelectField
                  label="Tipo de Servicio"
                  control={form.control}
                  name="reproductiveMethodId"
                  data={typeServices ?? []}
                  disabled={action === "edit"}
                />
                {typeService === "MN" ? (
                  <div className="font-bold">Monta Natural</div>
                ) : typeService === "IA" ? (
                  <div className="font-bold">Inseminación Artificial</div>
                ) : (
                  ""
                )}
                {typeService && (
                  <div className="border rounded flex flex-col gap-2 p-4">
                    {typeService === "IA" && (
                      <>
                        <div className="flex gap-4">
                          <SelectGeneticField
                            className="w-[50%]"
                            control={form.control}
                            name="semenBatch"
                            label="Codigo de Semen"
                            onChange={(data) => {
                              form.setValue("semenBatch", data.uniqueCode);
                            }}
                            disabled={action === "edit"}
                          />
                          <InputField
                            className="w-[50%]"
                            control={form.control}
                            name="strawsUsed"
                            label="Cantidad de Pajillas"
                            type="number"
                            disabled={action === "edit"}
                          />
                        </div>
                        <InputField
                          control={form.control}
                          name="inseminatedBy"
                          label="Inseminado Por"
                          disabled={action === "edit"}
                        />
                        <TextAreaField
                          control={form.control}
                          name="inseminationNotes"
                          label="Notas de Inseminación"
                        />
                      </>
                    )}
                    {typeService === "MN" && (
                      <>
                        <SelectAnimalField
                          control={form.control}
                          name="matingTagNumber"
                          label="Nro. Arete Toro"
                          onChange={(data) => {
                            form.setValue("matingMaleId", data.id);
                            form.setValue("matingTagNumber", data.tagNumber);
                            form.setValue("matingName", data.name);
                          }}
                          disabled={action === "edit"}
                          filterGender="male"
                        />
                        <InputField
                          control={form.control}
                          name="matingName"
                          label="Nombre Toro"
                          disabled
                        />
                        <TextAreaField
                          control={form.control}
                          name="matingDetails"
                          label="Detalles de la Monta"
                        />
                        <InputField
                          control={form.control}
                          name="performedBy"
                          label="Realizado Por"
                          disabled={action === "edit"}
                        />
                        <TextAreaField
                          control={form.control}
                          name="performedNotes"
                          label="Notas"
                        />
                      </>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 w-full mt-2">
                  <Button
                    disabled={loadingCreate || loadingUpdate}
                    type="submit"
                  >
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
        </>
      )}
      {showDeleteModal && (
        <DeleteModal
          onClose={(e: boolean) => {
            setShowDeleteModal(e);
          }}
          onAction={() => {
            onAction();
            onClose(false);
          }}
          id={data?.reproductionEventId ?? 0}
        />
      )}
    </Modal>
  );
};

export default ServicesModal;
