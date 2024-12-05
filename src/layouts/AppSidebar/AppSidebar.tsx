import { LogOut } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useUserStore } from "@/stores";
import { routes } from "@/routes";
import { ROLE } from "@/constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks";

export const AppSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActiveRoute = (path: string) => {
        return path === '' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(`/${path}`);
    };

    const { userInfo, logout } = useUserStore();

    const filteredRoutes = routes.filter(route => route.isSidebar && route.allowedRoles.includes(userInfo?.role as ROLE));

    const handleLogout = () => {
        logout();

        toast.success('Logged Out', {
            description: 'You have been successfully logged out.'
        });

        navigate('/login', { replace: true });
    };

    const isMobile = useIsMobile();

    return (
        <>
            <SidebarProvider>
                {isMobile && <SidebarTrigger></SidebarTrigger>}
                <Sidebar collapsible="icon" variant="sidebar">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {filteredRoutes.map((item) => (
                                        <SidebarMenuItem key={item.path}>
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={item.path}
                                                    className={cn(
                                                        "flex items-center p-2 rounded transition-colors duration-200",
                                                        isActiveRoute(item.path) ? "bg-sidebar-active" : ""
                                                    )}
                                                >
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Account</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton onClick={handleLogout}>
                                            <LogOut />
                                            <span>Logout</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
            <div className="bg-gray-50 flex-1 overflow-x-auto px-4 sm:px-0">
                <Outlet />
            </div>
        </>
    );
};