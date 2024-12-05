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
} from "@/components/ui/sidebar";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useUserStore } from "@/stores";
import { routes } from "@/routes";
import { ROLE } from "@/constants";
import { toast } from "sonner";

export const AppSidebar = () => {
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const { logout, } = useUserStore();


    const filteredRoutes = routes.filter(route => 
        route.allowedRoles.includes(userInfo?.role as ROLE)
    );

    const handleLogout = () => {
        logout();

        toast.success('Logged Out', {
            description: 'You have been successfully logged out.'
        });

        navigate('/login', { replace: true });
    };

    return (
        <>
            <SidebarProvider>
                <Sidebar variant="sidebar">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {filteredRoutes.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <NavLink to={item.path}>
                                                    <item.icon />
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
            <div className="flex-1"><Outlet /></div>
        </>
    )
}
