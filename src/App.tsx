import { Toaster } from "sonner";
import { ROLE } from "./constants";
import { AppSidebar } from "./layouts";
import { useUserStore } from "./stores";
import { PrivateRoute } from "./routes";
import { LoginPage } from "./pages/login";
import { SplashScreen } from "./components";
import { useEffect, useState } from "react";
import { NotFoundPage, UnauthorizedPage } from "./pages";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (userInfo) {
            setIsLoading(false);
            return;
        }
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (!userInfo) {
                if (location.pathname !== '/login') {
                    navigate('/login', { replace: true });
                }
            } else {
                if (location.pathname === '/login') {
                    navigate('/', { replace: true });
                }
            }
        }, 1500);

        return () => clearTimeout(timer)
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <div className="flex container mx-auto">
            <Toaster richColors position="top-right" />
            <Routes>
                <Route path="/" element={<AppSidebar />}>
                    <Route element={<PrivateRoute allowedRoles={[ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT]} />}>
                        <Route index element={<>Home Page</>} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLE.ADMIN, ROLE.TEACHER]} />}>
                        <Route path="dashboard" element={<>Dashboard <Outlet /></>}>
                            <Route index element={<>Dashboard Home</>} />
                            <Route element={<PrivateRoute allowedRoles={[ROLE.ADMIN]} />}>
                                <Route path="settings" element={<>Dashboard Setting</>} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="login" element={<LoginPage />} />
                <Route path="unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    )
}

export default App;