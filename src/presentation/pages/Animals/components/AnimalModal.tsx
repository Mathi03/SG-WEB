/* eslint-disable @typescript-eslint/no-explicit-any */
import InputField from "@components/fields/InputField";
import { Modal } from "@components/misc/Modal";
import { Form } from "@components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  animalFormSchema,
  AnimalFormSchema,
} from "@infrastructure/validations/animalValidation";
import DatePickerField from "@components/fields/DatePickerField";
import SelectField from "@components/fields/SelectField";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Loader2, Percent, Plus, Trash } from "lucide-react";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { useRequest } from "ahooks";
import RaceController from "@infrastructure/controllers/RaceController";
import { v4 as uuidv4 } from "uuid";
import AnimalController from "@infrastructure/controllers/AnimalController";
import { omit } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { toast } from "sonner";

interface AnimalModalProps {
  onClose?: (e: boolean) => void;
  action?: "add" | "edit";
  data?: AnimalFormSchema | null;
  onAction?: () => void;
}

const AnimalModal = ({
  onClose = () => {},
  action = "add",
  data = null,
  onAction = () => {},
}: AnimalModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const form = useForm<any>({
    resolver: zodResolver(animalFormSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name || "",
      tagNumber: data?.tagNumber || "",
      birthDate: data?.birthDate || new Date(),
      status: data?.status || "",
      classification: data?.classification || "",
      races: data?.races || [
        {
          id: uuidv4(),
          name: "",
          percentage: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "races",
  });

  const { data: listRaces = [], loading: loadingRaces } = useRequest(
    async () => {
      const response = await RaceController.search();
      return response.map((race) => ({
        label: race.name,
        value: race.name,
      }));
    }
  );

  const { run: runCreate, loading: loadingCreate } = useRequest(
    (animal) => AnimalController.create(animal),
    {
      manual: true,
      onSuccess: () => {
        toast.success("El animal ha sido creado.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );
  const { run: runUpdate, loading: loadingUpdate } = useRequest(
    (animal) => AnimalController.update(data?.id || 0, animal),
    {
      manual: true,
      onSuccess: () => {
        toast.success("El animal ha sido actualizado.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: AnimalFormSchema) => {
    const breed = data.races.reduce(
      (acc, race) => ({
        ...acc,
        [race.name]: race.percentage,
      }),
      {}
    );
    const sendData: any = omit(data, ["races"]);
    sendData.breed = breed;
    sendData.farmId = currentFarm?.id ?? 0;

    if (action === "add") {
      runCreate(sendData);
    } else {
      runUpdate(sendData);
    }
  };

  return (
    <Modal
      width="800px"
      height="auto"
      title={`${action === "add" ? "Agregar" : "Editar"} Animal`}
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      {loadingRaces ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                control={form.control}
                name="tagNumber"
                label="Nro. Arete"
              />
              <InputField control={form.control} name="name" label="Nombre" />
              <DatePickerField
                control={form.control}
                name="birthDate"
                label="Fecha de Nacimiento"
              />
              <SelectField
                control={form.control}
                name="sex"
                label="Género"
                data={[
                  { label: "Macho", value: "Male" },
                  { label: "Hembra", value: "Female" },
                ]}
              />
              <InputField
                control={form.control}
                name="status"
                label="Estado"
                type="text"
              />
              <InputField
                control={form.control}
                name="classification"
                label="Clasificación"
                type="text"
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between gap-2 w-full">
                  <Label>Raza</Label>
                  <Button
                    variant="default"
                    type="button"
                    size="icon"
                    onClick={() => {
                      append({
                        id: uuidv4(),
                        name: "",
                        percentage: 0,
                      });
                    }}
                    disabled={fields.length === 2}
                  >
                    <Plus />
                  </Button>
                </div>
                <Card>
                  {fields.map((race, index) => (
                    <div
                      key={`${race.id}-${uuidv4()}`}
                      className="flex items-center justify-between gap-4 p-2 border-blast:border-b-0"
                    >
                      <SelectField
                        className="w-[80%]"
                        control={form.control}
                        name={`races.${index}.name`}
                        data={listRaces}
                      />
                      <div className="w-[10%] flex items-center gap-2">
                        <InputField
                          type="number"
                          className="text-right"
                          control={form.control}
                          name={`races.${index}.percentage`}
                        />
                        <Percent width={40} />
                      </div>
                      <Button
                        variant="destructive"
                        type="button"
                        size="icon"
                        onClick={() => {
                          remove(index);
                          form.trigger("races");
                        }}
                        disabled={fields.length <= 1}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                </Card>
                {typeof form.formState.errors.races?.root?.message ===
                  "string" && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.races.root?.message}
                  </p>
                )}
                {typeof form.formState.errors.races?.message === "string" && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.races?.message}
                  </p>
                )}
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
                  type="button"
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
          id={data?.id ?? 0}
        />
      )}
    </Modal>
  );
};

export default AnimalModal;
