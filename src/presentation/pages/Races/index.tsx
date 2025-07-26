import Grid from "@components/misc/Grid";
import { Button } from "@components/ui/button";
import { ColDef } from "ag-grid-community";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import DeleteModal from "./components/DeleteModal";
import RaceModal from "./components/RaceModal";
import { useRequest } from "ahooks";
import RaceController from "@infrastructure/controllers/RaceController";
import { format } from "date-fns";
import { RaceSchema } from "@infrastructure/validations/raceValidation";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: RaceSchema | null;
}

const Race = () => {
  const [showModal, setShowModal] = useState<ModalStateProps>({
    show: false,
    action: "add",
    data: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const deleteId = useRef<number | null>(null);

  const columns: ColDef[] = [
    {
      field: "name",
      headerName: "Nombre de Raza",
      flex: 1,
      minWidth: 200,
      filter: "agTextColumnFilter",
    },
    {
      field: "createdAt",
      headerName: "Fecha de Creación",
      valueFormatter: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      filterValueGetter: ({ data }) => {
        return new Date(format(new Date(data.createdAt), "MM/dd/yyyy"));
      },
      filterParams: {
        buttons: ["apply", "clear"],
      },
      flex: 1,
      minWidth: 200,
      filter: "agDateColumnFilter",
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
      cellRenderer: ({ data }: { data: RaceSchema }) => {
        return (
          <div className="h-full w-full flex items-center justify-center gap-1">
            <Button
              size="icon"
              className="size-7"
              onClick={() => {
                setShowModal({
                  show: true,
                  action: "edit",
                  data,
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
          </div>
        );
      },
    },
  ];

  const {
    data: listRaces = [],
    loading: loadingRaces,
    refresh: refreshRaces,
  } = useRequest(() => RaceController.search());

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        data={listRaces}
        loading={loadingRaces}
        placeholder="Buscar raza..."
        onClick={() =>
          setShowModal({
            show: true,
            action: "add",
            data: null,
          })
        }
      />
      {showModal.show && (
        <RaceModal
          onClose={(e: boolean) => {
            setShowModal({ show: e, action: "add", data: null });
          }}
          action={showModal.action}
          data={showModal.data}
          onAction={() => {
            refreshRaces();
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
            refreshRaces();
          }}
          id={deleteId.current ?? 0}
        />
      )}
    </div>
  );
};

export default Race;
