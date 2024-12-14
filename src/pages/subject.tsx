import { lazy, Suspense } from 'react';
import { ROLE } from '@/constants';
import { useUserStore } from '@/stores';
import { LoadingSpinner } from '@/components';

const SubjectAdmin = lazy(() => import('./admin/subject/subject-admin'));

export const SubjectPage = () => {
    const { userInfo } = useUserStore();

    const SubjectComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <SubjectAdmin />;
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
            <SubjectComponent />
        </Suspense>
    )
};
