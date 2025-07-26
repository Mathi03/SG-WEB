import Grid from "@components/misc/Grid";
import { Button } from "@components/ui/button";
import { ColDef } from "ag-grid-community";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import DeleteModal from "./components/DeleteModal";
import ProductionModal from "./components/MilkProductionModal";
import { useRequest } from "ahooks";
import MilkProductionController from "@infrastructure/controllers/MilkProductionController";
import { format } from "date-fns";
import { MilkProductionSchema } from "@infrastructure/validations/milkProductionValidation";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: MilkProductionSchema | null;
}

const MilkProduction = () => {
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
      field: "shift",
      headerName: "Turno",
      width: 250,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => {
        switch (params.value) {
          case "morning":
            return "Mañana";
          case "afternoon":
            return "Tarde";
          case "night":
            return "Noche";
          default:
            return params.value;
        }
      },
    },
    {
      field: "amount",
      headerName: "Cantidad",
      width: 250,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => {
        return `${params.value} L`;
      },
    },
    {
      field: "milkedAt",
      headerName: "Fecha",
      width: 200,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      filterValueGetter: ({ data }) => {
        return new Date(format(new Date(data.milkedAt), "MM/dd/yyyy"));
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
      cellRenderer: ({ data }: { data: MilkProductionSchema }) => {
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
    data: listMilkProduction,
    loading: loadingListMilkProduction,
    refresh: refreshListMilkProduction,
  } = useRequest(
    () => MilkProductionController.search({ farmId: currentFarm?.id ?? 0 }),
    {
      refreshDeps: [currentFarm?.id],
    }
  );

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        loading={loadingListMilkProduction}
        data={listMilkProduction}
        placeholder="Buscar produccion lechera..."
        onClick={() =>
          setShowModal({
            show: true,
            action: "add",
            data: null,
          })
        }
      />
      {showModal.show && (
        <ProductionModal
          onClose={(e: boolean) => {
            setShowModal({ show: e, action: "add", data: null });
          }}
          action={showModal.action}
          data={showModal.data}
          onAction={() => {
            refreshListMilkProduction();
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
            refreshListMilkProduction();
          }}
          id={deleteId.current || 0}
        />
      )}
    </div>
  );
};

export default MilkProduction;
