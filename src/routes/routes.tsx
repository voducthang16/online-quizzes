import { ReactNode } from 'react';
import { ROLE } from '@/constants';
import { Home, LayoutDashboard, Settings, Users } from 'lucide-react';
import { UserPage } from '@/pages/user';

export interface RouteConfig {
    path: string;
    element: ReactNode;
    title: string;
    icon: any;
    allowedRoles: ROLE[];
    children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
    {
        path: '',
        element: <>Home Page</>,
        title: 'Home',
        icon: Home,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT]
    },
    {
        path: 'dashboard',
        element: <>Dashboard</>,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        children: [
            {
                path: '',
                element: <>Dashboard Home</>,
                title: 'Dashboard Home',
                icon: LayoutDashboard,
                allowedRoles: [ROLE.ADMIN, ROLE.TEACHER]
            },
            {
                path: 'settings',
                element: <>Dashboard Settings</>,
                title: 'Settings',
                icon: Settings,
                allowedRoles: [ROLE.ADMIN]
            }
        ]
    },
    {
        path: 'users',
        element: <UserPage />,
        title: 'Users',
        icon: Users,
        allowedRoles: [ROLE.ADMIN]
    }
];
