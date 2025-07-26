import Grid from "@components/misc/Grid";
import { ColDef } from "ag-grid-community";
import { useRequest } from "ahooks";
import PregnanciesController from "@infrastructure/controllers/PregnanciesController";
import { format } from "date-fns";
import { PregnanciesSchema } from "@infrastructure/validations/pregnanciesValidation";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: PregnanciesSchema | null;
}

const Pregnancies = () => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const columns: ColDef[] = [
    {
      field: "tagNumber",
      headerName: "Nro. Arete",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      field: "animalName",
      headerName: "Nombre",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      field: "date",
      headerName: "Fecha",
      width: 200,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      filterValueGetter: ({ data }) => {
        return new Date(format(new Date(data.date), "MM/dd/yyyy"));
      },
      filterParams: {
        buttons: ["apply", "clear"],
      },
    },
    {
      field: "expectedDueDate",
      headerName: "Fecha Estimada de Parto",
      width: 200,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      filterValueGetter: ({ data }) => {
        return new Date(format(new Date(data.date), "MM/dd/yyyy"));
      },
      filterParams: {
        buttons: ["apply", "clear"],
      },
    },
  ];

  const { data: listPregnancies, loading: loadingListPregnancies } = useRequest(
    () => PregnanciesController.search({ farmId: currentFarm?.id ?? 0 }),
    {
      refreshDeps: [currentFarm?.id],
    }
  );

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        loading={loadingListPregnancies}
        data={listPregnancies}
        placeholder="Buscar Palpacion..."
      />
    </div>
  );
};

export default Pregnancies;
