import { RootState } from "@application/store/store";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@components/ui/sidebar";
import { Separator } from "@components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@components/ui/breadcrumb";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../Layout/AppSidebar";
import { Loader2Icon } from "lucide-react";

const ProtectedRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const farms = useSelector((state: RootState) => state.farm);

  const location = useLocation();

  return user ? (
    <>
      {location.pathname === "/" ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <>
          {!farms.length ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex flex-col w-full p-screen">
                <header className="flex h-[64px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            {location.pathname
                              ?.replace("/", "")?.[0]
                              ?.toUpperCase()}
                            {location.pathname
                              ?.replace("/", "")
                              ?.substring(1, location.pathname.length)}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
                <div className="h-[calc(100%-64px)] overflow-hidden">
                  <div className="p-4 h-full overflow-y-auto">
                    <Outlet />
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          )}
        </>
      )}
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
