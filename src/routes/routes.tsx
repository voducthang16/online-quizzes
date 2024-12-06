import { ReactNode } from 'react';
import { AppSidebar, MainLayout } from '@/layouts';
import { ROLE, ROUTES } from '@/constants';
import { BookHeart, Landmark, LayoutDashboard, School, Users } from 'lucide-react';
import {
    DashboardPage,
    UserPage,
    ClassPage,
    LoginPage,
    NotFoundPage,
    UnauthorizedPage,
    BankPage,
    SubjectPage,
} from '@/pages';

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
        layout: <MainLayout />,
    },
    {
        path: ROUTES.USER,
        element: <UserPage />,
        title: 'User',
        icon: Users,
        allowedRoles: [ROLE.ADMIN],
        isSidebar: true,
        layout: <MainLayout />,
    },
    {
        path: ROUTES.SUBJECT,
        element: <SubjectPage />,
        title: 'Subject',
        icon: BookHeart,
        allowedRoles: [ROLE.ADMIN],
        isSidebar: true,
        layout: <MainLayout />,
    },
    {
        path: ROUTES.CLASS,
        element: <ClassPage />,
        title: 'Class',
        icon: School,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        isSidebar: true,
        layout: <MainLayout />,
    },
    {
        path: ROUTES.BANK,
        element: <BankPage />,
        title: 'Bank',
        icon: Landmark,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        isSidebar: true,
        layout: <MainLayout />,
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
