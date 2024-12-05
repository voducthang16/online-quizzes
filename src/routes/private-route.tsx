import { FC } from "react";
import { ROLE } from "@/constants";
import { useUserStore } from "@/stores";
import { Outlet, Navigate } from "react-router";

interface PrivateRouteProps {
    allowedRoles: ROLE[];
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { userInfo } = useUserStore();

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    const isAllowed = allowedRoles.includes(userInfo.role as ROLE);

    return isAllowed ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
