import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components";

const ClassAdmin = lazy(() => import('./admin/class/class-admin'));

export const ClassPage = () => {
    const { userInfo } = useUserStore();

    const ClassComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <ClassAdmin />;
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
            <ClassComponent />
        </Suspense>
    )
};
