import Grid from "@components/misc/Grid";
import { Button } from "@components/ui/button";
import { ColDef } from "ag-grid-community";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useRequest } from "ahooks";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import ServiceController from "@infrastructure/controllers/ServiceController";
import { ServiceSchema } from "@infrastructure/validations/serviceValidation";
import DeleteModal from "./components/DeleteModal";
import ServicesModal from "./components/ServicesModal";
import { format } from "date-fns";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: ServiceSchema | null;
}

const Services = () => {
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
      field: "motherTagNumber",
      headerName: "Nro. Arete",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      field: "motherName",
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
      field: "reproductiveMethodId",
      headerName: "Tipo de Servicio",
      filter: "agTextColumnFilter",
      valueFormatter: ({ value }) => {
        if (value === 2) return "Monta Natural";
        if (value === 1) return "Inseminación Artificial";
        return ``;
      },
      flex: 1,
      minWidth: 150,
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
      cellRenderer: ({ data }: { data: ServiceSchema }) => {
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
                deleteId.current = data.reproductionEventId ?? 0;
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
    data: listServices,
    loading: loadingListServices,
    refresh: refreshListServices,
  } = useRequest(
    () => ServiceController.search({ farmId: currentFarm?.id ?? 0 }),
    {
      refreshDeps: [currentFarm?.id],
    }
  );

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        loading={loadingListServices}
        data={listServices}
        placeholder="Buscar Servicios..."
        onClick={() =>
          setShowModal({
            show: true,
            action: "add",
            data: null,
          })
        }
      />
      {showModal.show && (
        <ServicesModal
          onClose={(e: boolean) => {
            setShowModal({ show: e, action: "add", data: null });
          }}
          action={showModal.action}
          data={showModal.data}
          onAction={() => {
            refreshListServices();
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
            refreshListServices();
          }}
          id={deleteId.current || 0}
        />
      )}
    </div>
  );
};

export default Services;
