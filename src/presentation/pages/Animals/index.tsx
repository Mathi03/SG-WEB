/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from "@components/misc/Grid";
import { Button } from "@components/ui/button";
import { ColDef } from "ag-grid-community";
import { Edit, Eye, Trash } from "lucide-react";
import { useRef, useState } from "react";
import AnimalModal from "./components/AnimalModal";
import DeleteModal from "./components/DeleteModal";
import {
  AnimalFormSchema,
  AnimalSchema,
} from "@infrastructure/validations/animalValidation";
import { useRequest } from "ahooks";
import AnimalController from "@infrastructure/controllers/AnimalController";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: AnimalFormSchema | null;
}

const Animals = () => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const [showModal, setShowModal] = useState<ModalStateProps>({
    show: false,
    action: "add",
    data: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const deleteId = useRef<number | null>(null);

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
      width: 150,
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
      field: "status",
      headerName: "Estado",
      width: 200,
      filter: "agSetColumnFilter",
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
      field: "classification",
      headerName: "Clasificación",
      filter: "agSetColumnFilter",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: "Acciones",
      filter: false,
      sortable: false,
      resizable: false,
      floatingFilter: false,
      pinned: "right",
      width: 120,
      cellRenderer: ({ data }: { data: AnimalSchema }) => {
        return (
          <div className="h-full w-full flex items-center justify-center gap-1">
            <Button
              size="icon"
              className="size-7"
              onClick={() => {
                const races: any = data?.breed
                  ? Object.entries(data.breed).map(([name, percentage]) => ({
                      id: uuidv4(),
                      name,
                      percentage:
                        typeof percentage === "number" ? percentage : 0,
                    }))
                  : [];

                setShowModal({
                  show: true,
                  action: "edit",
                  data: {
                    ...data,
                    races,
                  },
                });
              }}
            >
              <Edit />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="size-7"
              onClick={() => {
                setShowDeleteModal(true);
                deleteId.current = data.id ?? null;
              }}
            >
              <Trash />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-7 border border-gray-300 hover:bg-gray-100"
            >
              <Eye />
            </Button>
          </div>
        );
      },
    },
  ];

  const {
    data: listAnimals = [],
    loading: loadingAnimals,
    refresh: refreshAnimals,
  } = useRequest(
    () => AnimalController.search({ farmId: currentFarm?.id ?? 0 }),
    {
      refreshDeps: [currentFarm?.id],
    }
  );

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        data={listAnimals}
        loading={loadingAnimals}
        placeholder="Buscar animal..."
        onClick={() =>
          setShowModal({
            show: true,
            action: "add",
            data: null,
          })
        }
      />
      {showModal.show && (
        <AnimalModal
          onClose={(e: boolean) => {
            setShowModal({ show: e, action: "add", data: null });
          }}
          action={showModal.action}
          data={showModal.data}
          onAction={() => {
            refreshAnimals();
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onClose={(e: boolean) => {
            setShowDeleteModal(e);
            deleteId.current = null;
          }}
          onAction={() => {
            refreshAnimals();
          }}
          id={deleteId.current}
        />
      )}
    </div>
  );
};

export default Animals;
