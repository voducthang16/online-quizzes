import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components";

const BankAdmin = lazy(() => import('./admin/bank/bank-admin'));

export const BankPage = () => {
    const { userInfo } = useUserStore();

    const BankComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <BankAdmin />;
                case ROLE.TEACHER:
                    return <BankAdmin isTeacherView />;
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
            <BankComponent />
        </Suspense>
    )
};
