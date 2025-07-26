/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  QuickFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { useCallback, useMemo, useRef } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

ModuleRegistry.registerModules([
  AllCommunityModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
]);

interface GridProps<T> {
  loading?: boolean;
  columns?: ColDef[];
  data?: T[];
  placeholder?: string;
  onClick?: () => void;
  buttonTitle?: string;
  disableInputSearch?: boolean;
  onRowClicked?: (data: T) => void;
}
const Grid = <T,>({
  loading = false,
  columns = [],
  data = [],
  placeholder = "Search",
  onClick = () => {},
  buttonTitle = "Agregar",
  disableInputSearch = false,
  onRowClicked = () => {},
}: GridProps<T>) => {
  const gridRef = useRef<AgGridReact>(null);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      suppressHeaderMenuButton: true,
      filter: true,
      floatingFilter: true,
    };
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {!disableInputSearch && (
        <div className="mb-4 flex items-center justify-between gap-1">
          <Input
            type="text"
            id="filter-text-box"
            placeholder={placeholder}
            onInput={onFilterTextBoxChanged}
          />
          <Button
            variant="outline"
            size="default"
            onClick={() => onClick()}
            className="w-[120px]"
          >
            <Plus /> {buttonTitle}
          </Button>
        </div>
      )}
      <AgGridReact
        onRowClicked={({ data }: any) => {
          onRowClicked(data);
        }}
        ref={gridRef}
        rowData={data}
        columnDefs={columns}
        loading={loading}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default Grid;
