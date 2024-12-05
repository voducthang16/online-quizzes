import { ROLE } from "@/constants";
import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { useUserStore } from "@/stores";

const DashboardAdmin = lazy(() => import('./admin/dashboard-admin'));
const DashboardTeacher = lazy(() => import('./teacher/dashboard-teacher'));
const DashboardStudent = lazy(() => import('./student/dashboard-student'));

export const DashboardPage = () => {
    const { userInfo } = useUserStore();

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
        </div>
    );

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
