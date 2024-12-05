import { ReactNode } from 'react';
import { ROLE, ROUTES } from '@/constants';
import { AppSidebar } from '@/layouts';
import { Landmark, LayoutDashboard, Users } from 'lucide-react';
import { DashboardPage, UsersPage, LoginPage, NotFoundPage, UnauthorizedPage, BankPage } from '@/pages';

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
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
        isSidebar: true,
        layout: <AppSidebar />,
    },
    {
        path: ROUTES.USERS,
        element: <UsersPage />,
        title: 'Users',
        icon: Users,
        allowedRoles: [ROLE.ADMIN],
        isSidebar: true,
        layout: <AppSidebar />,
    },
    {
        path: ROUTES.BANKS,
        element: <BankPage />,
        title: 'Banks',
        icon: Landmark,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        isSidebar: true,
        layout: <AppSidebar />,
    },
    {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
    },
    {
        path: ROUTES.UNAUTHORIZED,
        element: <UnauthorizedPage />,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
    },
    {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
    }
];
