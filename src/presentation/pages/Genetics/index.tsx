import Grid from "@components/misc/Grid";
import { Button } from "@components/ui/button";
import { ColDef } from "ag-grid-community";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import DeleteModal from "./components/DeleteModal";
import { useRequest } from "ahooks";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import GeneticsModal from "./components/GeneticsModal";
import { GeneticsSchema } from "@infrastructure/validations/geneticsValidation";
import GeneticsController from "@infrastructure/controllers/GeneticsController";

export interface ModalStateProps {
  show: boolean;
  action: "add" | "edit";
  data: GeneticsSchema | null;
}

const Genetics = () => {
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
      field: "uniqueCode",
      headerName: "Codigo",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      field: "purchaseDate",
      headerName: "Fecha",
      width: 200,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      filterValueGetter: ({ data }) => {
        return new Date(format(new Date(data.purchaseDate), "MM/dd/yyyy"));
      },
      filterParams: {
        buttons: ["apply", "clear"],
      },
    },
    {
      field: "purchasePrice",
      headerName: "Precio de Compra",
      filter: "agNumberColumnFilter",
      valueFormatter: ({ value }) => {
        return `$ ${value} `;
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: "stock",
      headerName: "Stock",
      filter: "agNumberColumnFilter",
      valueFormatter: ({ value }) => {
        return `${value} Unidades`;
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
      cellRenderer: ({ data }: { data: GeneticsSchema }) => {
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
    data: listGenetics,
    loading: loadingListGenetics,
    refresh: refreshListGenetics,
  } = useRequest(
    () => GeneticsController.search({ farmId: currentFarm?.id ?? 0 }),
    {
      refreshDeps: [currentFarm?.id],
    }
  );

  return (
    <div className="h-full w-full">
      <Grid
        columns={columns}
        loading={loadingListGenetics}
        data={listGenetics}
        placeholder="Buscar Pajilla de Semen..."
        onClick={() =>
          setShowModal({
            show: true,
            action: "add",
            data: null,
          })
        }
      />
      {showModal.show && (
        <GeneticsModal
          onClose={(e: boolean) => {
            setShowModal({ show: e, action: "add", data: null });
          }}
          action={showModal.action}
          data={showModal.data}
          onAction={() => {
            refreshListGenetics();
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
            refreshListGenetics();
          }}
          id={deleteId.current || 0}
        />
      )}
    </div>
  );
};

export default Genetics;
