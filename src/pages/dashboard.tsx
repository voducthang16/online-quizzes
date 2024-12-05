import { ROLE } from "@/constants";
import { lazy, Suspense } from "react";
import { useUserStore } from "@/stores";
import { LoadingSpinner } from "@/components";

const DashboardAdmin = lazy(() => import('./admin/dashboard-admin'));
const DashboardTeacher = lazy(() => import('./teacher/dashboard-teacher'));
const DashboardStudent = lazy(() => import('./student/dashboard-student'));

export const DashboardPage = () => {
    const { userInfo } = useUserStore();

    const DashboardComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <DashboardAdmin />;
            case ROLE.TEACHER:
                return <DashboardTeacher />;
            case ROLE.STUDENT:
                return <DashboardStudent />;
            default:
                return (
                    <div className="text-center text-red-500">
                        No dashboard available for your role
                    </div>
                );
        }
    };

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DashboardComponent />
        </Suspense>
    )
};
