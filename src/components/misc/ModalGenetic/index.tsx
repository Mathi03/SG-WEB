import { ColDef } from "ag-grid-community";
import Grid from "../Grid";
import { Modal } from "../Modal";
import { useRequest } from "ahooks";
import { RootState } from "@application/store/store";
import { useSelector } from "react-redux";
import GeneticsController from "@infrastructure/controllers/GeneticsController";
import { GeneticsSchema } from "@infrastructure/validations/geneticsValidation";
import { format } from "date-fns";

interface ModalGeneticProps {
  onClose: (e: boolean) => void;
  onChange?: (data: GeneticsSchema) => void;
}

const ModalGenetic = ({ onClose, onChange = () => {} }: ModalGeneticProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const currentFarm = farms.find((farm) => farm.current);

  const columns: ColDef[] = [
    {
      field: "uniqueCode",
      headerName: "Codigo",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      field: "stock",
      headerName: "Stock",
      filter: "agNumberColumnFilter",
      valueFormatter: ({ value }) => {
        return `${value} Unidades`;
      },
      width: 150,
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
  ];

  const { data: listGenetics, loading: loadingListGenetics } = useRequest(() =>
    GeneticsController.search({ farmId: currentFarm?.id ?? 0 })
  );

  return (
    <Modal
      title="Stock Genetico"
      width="1000px"
      height="600px"
      onClose={onClose}
    >
      <Grid
        columns={columns}
        loading={loadingListGenetics}
        data={listGenetics}
        disableInputSearch
        onRowClicked={(data) => {
          onChange(data);
        }}
      />
    </Modal>
  );
};

export default ModalGenetic;
