import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    submenuItems: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="select-none">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.submenuItems.map((item) => (
              <SidebarMenuButton
                // disabled
                className={`select-none ${
                  pathname === item.url
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }`}
                tooltip={item.title}
                onClick={() => navigate(item.url)}
                key={item.title}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
