/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColDef } from "ag-grid-community";
import Grid from "../Grid";
import { Modal } from "../Modal";
import { useRequest } from "ahooks";
import AnimalController from "@infrastructure/controllers/AnimalController";
import { AnimalSchema } from "@infrastructure/validations/animalValidation";
import { RootState } from "@application/store/store";
import { useSelector } from "react-redux";

interface ModalAnimalProps {
  onClose: (e: boolean) => void;
  onChange?: (data: AnimalSchema) => void;
  filterStatus?: string;
  filterGender?: string;
}

const ModalAnimal = ({
  onClose,
  onChange = () => {},
  filterStatus,
  filterGender,
}: ModalAnimalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const columns: ColDef[] = [
    {
      field: "tagNumber",
      headerName: "Nro. Arete",
      width: 120,
      filter: "agNumberColumnFilter",
    },
    {
      field: "name",
      headerName: "Nombre",
      width: 300,
      filter: "agTextColumnFilter",
    },
    {
      field: "sex",
      headerName: "Género",
      width: 150,
      filter: "agTextColumnFilter",
      valueFormatter: ({ value }) => {
        return value === "Male" ? "Macho" : "Hembra";
      },
    },
    {
      field: "breed",
      headerName: "Raza",
      width: 300,
      filter: "agTextColumnFilter",
      cellRenderer: ({ value }: any) => {
        if (!value || typeof value !== "object") return null;

        const entries = Object.entries(value);
        return (
          <span className="flex flex-wrap gap-1">
            {entries.map(([name, percentage], index) => (
              <span key={index}>
                {name} ({typeof percentage === "number" ? percentage : 0}%)
                {index < entries.length - 1 && " - "}
              </span>
            ))}
          </span>
        );
      },
    },
    {
      field: "age",
      headerName: "Edad",
      width: 250,
      filter: "agTextColumnFilter",
    },
    {
      field: "status",
      headerName: "Estado",
      width: 200,
      filter: "agSetColumnFilter",
    },
    {
      field: "classification",
      headerName: "Clasificación",
      filter: "agSetColumnFilter",
      flex: 1,
      minWidth: 200,
    },
  ];

  const { data: listAnimals = [], loading: loadingAnimals } = useRequest(
    async () => {
      const response = await AnimalController.search({
        farmId: currentFarm?.id ?? 0,
        status: filterStatus,
        gender: filterGender,
      });
      if (filterGender === "male") {
        return response.filter((animal) => animal.sex === "Male");
      }
      if (filterGender === "female") {
        return response.filter((animal) => animal.sex === "Female");
      }
      return response;
    }
  );

  return (
    <Modal title="Animales" width="1000px" height="600px" onClose={onClose}>
      <Grid
        columns={columns}
        loading={loadingAnimals}
        data={listAnimals}
        disableInputSearch
        onRowClicked={(data) => {
          onChange(data);
        }}
      />
    </Modal>
  );
};

export default ModalAnimal;
