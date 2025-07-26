import {
  ArrowLeftRight,
  BadgeDollarSign,
  Boxes,
  Cake,
  Calendar,
  Dna,
  House,
  LayoutDashboard,
  Leaf,
  Library,
  LifeBuoy,
  Milk,
  Replace,
  Shield,
  Syringe,
  Upload,
  User2,
  Vegan,
  Weight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@components/ui/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavUser } from "./NavUser";
import { ComponentProps } from "react";
import { NavMain } from "./NavMain";

const submenu = [
  {
    title: "Plataforma",
    submenuItems: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Calendario",
        url: "/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Control de Animales",
    submenuItems: [
      {
        title: "Animales",
        url: "/animals",
        icon: Vegan,
      },
      {
        title: "Carga Masiva",
        url: "/bulk-upload",
        icon: Upload,
      },
    ],
  },
  {
    title: "Control de Producción",
    submenuItems: [
      {
        title: "Producción Lechera",
        url: "/production",
        icon: Milk,
      },
      {
        title: "Pesaje",
        url: "/weighing",
        icon: Weight,
      },
    ],
  },
  {
    title: "Control de Reproducción",
    submenuItems: [
      {
        title: "Existencias Geneticas",
        url: "/genetics",
        icon: Dna,
      },
      {
        title: "Celo",
        url: "/cel",
        icon: Leaf,
      },
      {
        title: "Servicios",
        url: "/services",
        icon: LifeBuoy,
      },
      {
        title: "Palpaciones",
        url: "/palpations",
        icon: Boxes,
      },
      {
        title: "Preñeces",
        url: "/pregnancies",
        icon: Shield,
      },
      {
        title: "Nacimientos",
        url: "/births",
        icon: Cake,
      },
    ],
  },
  {
    title: "Control de Sanitario",
    submenuItems: [
      {
        title: "Vacunas",
        url: "/vaccines",
        icon: Syringe,
      },
    ],
  },
  {
    title: "Mas",
    submenuItems: [
      {
        title: "Reportes",
        url: "/reports",
        icon: Library,
      },
      {
        title: "Razas",
        url: "/races",
        icon: Replace,
      },
      {
        title: "Usuarios",
        url: "/users",
        icon: User2,
      },
      {
        title: "Transferencias",
        url: "/transfers",
        icon: ArrowLeftRight,
      },
      {
        title: "Ventas",
        url: "/sales",
        icon: BadgeDollarSign,
      },
    ],
  },
];

const teams = [
  {
    name: "Hacienda Norte",
    logo: House,
    plan: "Enterprise",
  },
  {
    name: "Hacienda Sur",
    logo: House,
    plan: "Startup",
  },
  {
    name: "Hacienda Este",
    logo: House,
    plan: "Free",
  },
  {
    name: "Hacienda Oeste",
    logo: House,
    plan: "Free",
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={submenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
