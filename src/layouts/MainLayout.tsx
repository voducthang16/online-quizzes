import { Outlet } from "react-router"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useUserStore } from "@/stores";

export const MainLayout = () => {
    const { userInfo } = useUserStore();
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div>
                            Hi {userInfo?.full_name} - {userInfo?.role}
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col p-4">
                        <div className="grid">
                            <Outlet />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
};
