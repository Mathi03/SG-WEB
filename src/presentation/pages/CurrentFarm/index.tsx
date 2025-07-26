import DatePickerField from "@components/fields/DatePickerField";
import InputField from "@components/fields/InputField";
import SelectField from "@components/fields/SelectField";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  farmSchema,
  FarmSchema,
} from "@infrastructure/validations/farmValidation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DeleteModal from "./components/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import FarmController from "@infrastructure/controllers/FarmController";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";
import { setFarms } from "@application/slices/farmSlice";
import { toast } from "sonner";

const CurrentFarm = () => {
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);
  const form = useForm<FarmSchema>({
    resolver: zodResolver(farmSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const { data, loading } = useRequest(
    () => FarmController.searchOne(Number(currentFarm?.id ?? "0")),
    {
      ready: !!currentFarm?.id,
      onSuccess: (response) => {
        form.reset({
          name: response.name,
          createdAt: new Date(response.createdAt),
          serviceSymbol: response.serviceSymbol,
          weightUnitSymbol: response.weightUnitSymbol,
          volumeUnitSymbol: response.volumeUnitSymbol,
          currencyUnitSymbol: response.currencyUnitSymbol,
        });
      },
    }
  );

  const { loading: loadingUpdate, run: runUpdate } = useRequest(
    (data) => FarmController.update(Number(currentFarm?.id ?? 0), data),
    {
      manual: true,
      onSuccess: (response) => {
        toast.success("Hacienda actualizada exitosamente.");
        const updatedFarms = farms.map((farm) =>
          farm.id === response.id ? { ...farm, ...response } : farm
        );
        dispatch(setFarms(updatedFarms));
        form.reset({
          name: response.name,
          createdAt: new Date(response.createdAt),
          serviceSymbol: response.serviceSymbol,
          weightUnitSymbol: response.weightUnitSymbol,
          volumeUnitSymbol: response.volumeUnitSymbol,
          currencyUnitSymbol: response.currencyUnitSymbol,
        });
        setShowDeleteModal(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: FarmSchema) => {
    runUpdate(data);
  };

  return (
    <div className="h-full w-full">
      <Label className="block text-md font-medium pb-4">
        {currentFarm?.name}
      </Label>
      {loading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardContent className="flex flex-col gap-4">
                <InputField
                  name="name"
                  label="Nombre de hacienda"
                  control={form.control}
                />
                <DatePickerField
                  name="createdAt"
                  label="Fecha de creación"
                  control={form.control}
                />
                <SelectField
                  name="serviceSymbol"
                  label="Servicios"
                  control={form.control}
                  data={[
                    {
                      value: "IAMN",
                      label: "Inseminación Artificial y Monta Natural",
                    },
                    { value: "IA", label: "Inseminación Artificial" },
                    { value: "MN", label: "Monta Natural" },
                  ]}
                />
                <div className="flex gap-4">
                  <SelectField
                    className="w-[33%]"
                    name="weightUnitSymbol"
                    label="Medida de pesaje"
                    control={form.control}
                    data={[
                      { value: "kg", label: "Kilogramos (Kg)" },
                      { value: "lb", label: "Libras (Lb)" },
                    ]}
                  />
                  <SelectField
                    className="w-[33%]"
                    name="volumeUnitSymbol"
                    label="Medida de Producción Lechera"
                    control={form.control}
                    data={[
                      { value: "l", label: "Litros (L)" },
                      { value: "gl", label: "Galones (Gal)" },
                    ]}
                  />
                  <SelectField
                    className="w-[33%]"
                    name="currencyUnitSymbol"
                    label="Unidad Monetaria"
                    control={form.control}
                    data={[
                      { value: "USD", label: "Dólar Estadounidense (USD)" },
                      { value: "EUR", label: "Euro (EUR)" },
                      { value: "SOL", label: "Sol Peruano (SOL)" },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button type="submit" disabled={loadingUpdate}>
                {loadingUpdate && <Loader2 className="animate-spin" />}
                Guardar
              </Button>
              <Button
                disabled={loadingUpdate}
                variant="destructive"
                type="button"
                onClick={() => setShowDeleteModal(true)}
              >
                Eliminar
              </Button>
              <div className="grow" />
              <Button
                disabled={loadingUpdate}
                variant="secondary"
                type="button"
                onClick={() =>
                  form.reset({
                    name: data.name,
                    createdAt: new Date(data.createdAt),
                    serviceSymbol: data.serviceSymbol,
                    weightUnitSymbol: data.weightUnitSymbol,
                    volumeUnitSymbol: data.volumeUnitSymbol,
                    currencyUnitSymbol: data.currencyUnitSymbol,
                  })
                }
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      )}
      {showDeleteModal && (
        <DeleteModal
          id={currentFarm?.id ?? 0}
          onClose={(e: boolean) => {
            setShowDeleteModal(e);
          }}
        />
      )}
    </div>
  );
};

export default CurrentFarm;
