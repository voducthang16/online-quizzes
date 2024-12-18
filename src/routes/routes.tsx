import { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { ROLE, ROUTES } from '@/constants';
import { BookHeart, FileQuestion, Landmark, LayoutDashboard, School, Users, Vote } from 'lucide-react';
import {
    DashboardPage,
    UserPage,
    ClassPage,
    LoginPage,
    NotFoundPage,
    UnauthorizedPage,
    BankPage,
    SubjectPage,
    QuestionPage,
} from '@/pages';
import { ExamPage } from '@/pages/exam';
import ClassDetailPage from '@/pages/share/class-detail';
import TakeExamPage from '@/pages/share/take-exam';
import ViewResultPage from '@/pages/share/view-result';
import TeacherExamDetail from '@/pages/share/teacher-view-exam';

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
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
        isSidebar: true,
        layout: <MainLayout />,
        children: [
            {
                path: ROUTES.CLASS_ROUTE.DETAIL,
                element: <ClassDetailPage />,
                title: 'Class Detail',
                icon: Users,
                allowedRoles: [ROLE.TEACHER, ROLE.STUDENT],
                children: [
                    {
                        path: ROUTES.CLASS_ROUTE.TAKE_EXAM,
                        title: 'Take Exam',
                        element: <TakeExamPage />,
                        allowedRoles: [ROLE.STUDENT],
                    },
                    {
                        path: ROUTES.CLASS_ROUTE.VIEW_RESULT,
                        title: 'Exam Result',
                        element: <ViewResultPage />,
                        allowedRoles: [ROLE.STUDENT],
                    },
                    {
                        path: ROUTES.CLASS_ROUTE.VIEW_DETAIL,
                        title: 'Exam Detail',
                        element: <TeacherExamDetail />,
                        allowedRoles: [ROLE.TEACHER],
                    },
                ]
            },
        ]
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
        path: ROUTES.EXAM,
        element: <ExamPage />,
        title: 'Exam',
        icon: Vote,
        allowedRoles: [ROLE.ADMIN, ROLE.TEACHER],
        isSidebar: true,
        layout: <MainLayout />,
    },
    {
        path: ROUTES.QUESTION,
        element: <QuestionPage />,
        title: 'Question',
        icon: FileQuestion,
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
