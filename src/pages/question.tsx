import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components";

const QuestionAdmin = lazy(() => import('./admin/question/question-admin'));

export const QuestionPage = () => {
    const { userInfo } = useUserStore();

    const QuestionComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <QuestionAdmin />;
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
            <QuestionComponent />
        </Suspense>
    )
};
