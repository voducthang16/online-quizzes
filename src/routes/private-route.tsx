import { FC, ReactNode } from "react";
import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { Outlet, Navigate } from "react-router";

interface PrivateRouteProps {
    allowedRoles: ROLE[];
    children?: ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
    const { userInfo } = useUserStore();

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    const isAllowed = allowedRoles.includes(userInfo.role as ROLE);

    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};
