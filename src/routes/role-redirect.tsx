import { FC, ReactNode } from "react";
import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { Navigate } from "react-router";

interface RoleRedirectProps {
    children: ReactNode;
    redirectPath: string;
    restrictedRoles: ROLE[];
}

export const RoleRedirect: FC<RoleRedirectProps> = ({ 
    children, 
    redirectPath, 
    restrictedRoles 
}) => {
    const { userInfo } = useUserStore();

    if (restrictedRoles.includes(userInfo?.role as ROLE)) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};
