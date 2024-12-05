import { ReactNode } from 'react';
import { ROLE } from '@/constants';
import { AppSidebar } from '@/layouts';
import { UserPage } from '@/pages/user';
import { Landmark, LayoutDashboard, Users } from 'lucide-react';
import { DashboardPage, LoginPage, NotFoundPage, UnauthorizedPage, BankPage } from '@/pages';

export interface RouteConfig {
    path: string;
    element: ReactNode;
    title?: string;
    icon?: any;
    allowedRoles: ROLE[];
    isSidebar?: boolean;
    layout?: ReactNode;
    children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
    {
        path: '',
        element: <DashboardPage />,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
        isSidebar: true,
        layout: <AppSidebar />,
    },
    {
        path: 'users',
        element: <UserPage />,
        title: 'Users',
        icon: Users,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        isSidebar: true,
        layout: <AppSidebar />,
    },
    {
        path: 'banks',
        element: <BankPage />,
        title: 'Banks',
        icon: Landmark,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        isSidebar: true,
        layout: <AppSidebar />,
    },
    {
        path: 'login',
        element: <LoginPage />,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
    },
    {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
    },
    {
        path: '*',
        element: <NotFoundPage />,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
    }
];
