import Grid from "@components/misc/Grid";
import { Button } from "@components/ui/button";
import { ColDef } from "ag-grid-community";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import DeleteModal from "./components/DeleteModal";
import { useRequest } from "ahooks";
import WeighingController from "@infrastructure/controllers/WeighingController";
import { format } from "date-fns";
import { WeighingSchema } from "@infrastructure/validations/weighingValidation";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import WeighingModal from "./components/WeighingModal";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: WeighingSchema | null;
}

const Weighing = () => {
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
      filter: "agTextColumnFilter",
    },
    {
      field: "animalName",
      headerName: "Nombre",
      width: 300,
      filter: "agTextColumnFilter",
    },
    {
      field: "weight",
      headerName: "Peso",
      width: 250,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => {
        return `${params.value} Kg`;
      },
    },
    {
      field: "weighedAt",
      headerName: "Fecha",
      width: 200,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      filterValueGetter: ({ data }) => {
        return new Date(format(new Date(data.weighedAt), "MM/dd/yyyy"));
      },
      filterParams: {
        buttons: ["apply", "clear"],
      },
    },
    {
      field: "notes",
      headerName: "Notas",
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 400,
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
      cellRenderer: ({ data }: { data: WeighingSchema }) => {
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
                deleteId.current = data.id ?? 0;
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
    data: listWeighing,
    loading: loadingListWeighing,
    refresh: refreshListWeighing,
  } = useRequest(
    () => WeighingController.search({ farmId: currentFarm?.id ?? 0 }),
    {
      refreshDeps: [currentFarm?.id],
    }
  );

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        loading={loadingListWeighing}
        data={listWeighing}
        placeholder="Buscar pesaje..."
        onClick={() =>
          setShowModal({
            show: true,
            action: "add",
            data: null,
          })
        }
      />
      {showModal.show && (
        <WeighingModal
          onClose={(e: boolean) => {
            setShowModal({ show: e, action: "add", data: null });
          }}
          action={showModal.action}
          data={showModal.data}
          onAction={() => {
            refreshListWeighing();
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
            refreshListWeighing();
          }}
          id={deleteId.current || 0}
        />
      )}
    </div>
  );
};

export default Weighing;
