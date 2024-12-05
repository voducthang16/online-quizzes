import { lazy, Suspense } from 'react';
import { ROLE } from '@/constants';
import { useUserStore } from '@/stores';
import { LoadingSpinner } from '@/components';

const UserAdmin = lazy(() => import('./admin/user/user-admin'));

export const UsersPage = () => {
    const { userInfo } = useUserStore();

    const UserComponent = () => {
        switch (userInfo?.role) {
            case ROLE.ADMIN:
                return <UserAdmin />;
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
            <UserComponent />
        </Suspense>
    )
}