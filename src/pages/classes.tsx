import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components";

const ClassesAdmin = lazy(() => import('./admin/class/class-admin'));

export const ClassesPage = () => {
    const { userInfo } = useUserStore();

    const ClassesComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <ClassesAdmin />;
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
            <ClassesComponent />
        </Suspense>
    )
};
