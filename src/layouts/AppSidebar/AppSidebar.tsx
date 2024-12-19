import { useState } from "react";
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
} from "@/components/ui/sidebar";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useUserStore } from "@/stores";
import { routes } from "@/routes";
import { ROLE, ROUTES } from "@/constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDialog, ConfirmDialogType } from "@/components";

export const AppSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isActiveRoute = (path: string) => {
        return path === '' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(`/${path}`);
    };

    const { userInfo, logout } = useUserStore();

    const filteredRoutes = routes?.filter(route => route?.isSidebar && route?.allowedRoles?.includes(userInfo?.role as ROLE));

    const handleLogout = () => {
        setIsDialogOpen(false);
        logout();

        toast.success('Logged Out', {
            description: 'You have been successfully logged out.'
        });

        navigate('/login', { replace: true });
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredRoutes.map((item) => {
                                if (item.path === ROUTES.DASHBOARD && userInfo.role !== ROLE.ADMIN) {
                                    return null;
                                }
                                return (
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
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <ConfirmDialog
                                    open={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                    title="Logout Confirmation"
                                    description="Are you sure you want to log out?"
                                    type={ConfirmDialogType.Warning}
                                    confirmText="Logout"
                                    onConfirm={handleLogout}
                                />
                                <SidebarMenuButton onClick={() => setIsDialogOpen(true)}>
                                    <LogOut />
                                    <span>Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};
