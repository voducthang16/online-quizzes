import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components";

const ExamAdmin = lazy(() => import('./admin/exam/exam-admin'));

export const ExamPage = () => {
    const { userInfo } = useUserStore();

    const ExamComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <ExamAdmin />;
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
            <ExamComponent />
        </Suspense>
    )
};
