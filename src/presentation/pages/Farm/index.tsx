import { setFarms } from "@application/slices/farmSlice";
import { RootState } from "@application/store/store";
import DatePickerField from "@components/fields/DatePickerField";
import InputField from "@components/fields/InputField";
import SelectField from "@components/fields/SelectField";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import FarmController from "@infrastructure/controllers/FarmController";
import {
  farmSchema,
  FarmSchema,
} from "@infrastructure/validations/farmValidation";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Farm = () => {
  const farms = useSelector((state: RootState) => state.farm);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<FarmSchema>({
    resolver: zodResolver(farmSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const { loading, run: runCreate } = useRequest(
    (data) => FarmController.create(data),
    {
      manual: true,
      onSuccess: (response) => {
        toast.success("Hacienda creada exitosamente.");
        const updatedFarms = [...farms, response].map((farm) => ({
          ...farm,
          current: farm.id === response.id,
        }));
        dispatch(setFarms(updatedFarms));
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );
  const onSubmit = (data: FarmSchema) => {
    runCreate(data);
  };

  return (
    <div className="h-full w-full">
      <Label className="block text-md font-medium pb-4">Nueva Hacienda</Label>
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
                    { value: "gal", label: "Galones (Gal)" },
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Guardar
            </Button>
            <div className="grow" />
            <Button variant="secondary" type="button" disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Farm;
