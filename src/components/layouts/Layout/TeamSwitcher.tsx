import { ChevronsUpDown, Edit, House, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { setFarms } from "@application/slices/farmSlice";

export function TeamSwitcher() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isMobile } = useSidebar();
  const farms = useSelector((state: RootState) => state.farm);

  const currentFarm = farms.find((farm) => farm.current);

  if (!currentFarm) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground select-none"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <House className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentFarm.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={() => {
                navigate("/current-farm");
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Edit className="size-4" />
              </div>
              Editar Hacienda
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Haciendas
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={() => {
                navigate("/farm");
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              Añadir Hacienda
            </DropdownMenuItem>
            {farms.map((farm) => (
              <DropdownMenuItem
                key={farm.name}
                onClick={() => {
                  const farmData = farms.map((f) => ({
                    ...f,
                    current: f.id === farm.id,
                  }));
                  dispatch(setFarms(farmData));
                  navigate("/animals");
                }}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <House className="size-3.5 shrink-0" />
                </div>
                {farm.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
