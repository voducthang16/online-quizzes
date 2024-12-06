import { Toaster } from "sonner";
import { useUserStore } from "./stores";
import { useEffect, useState } from "react";
import { SplashScreen } from "./components";
import { routes, PrivateRoute } from "./routes";
import { Route, Routes, useLocation, useNavigate } from "react-router";

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

        return () => clearTimeout(timer);
    }, [userInfo, location, navigate]);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <div className="">
            <Toaster richColors position="top-right" />
            <Routes>
                {routes.map((route) => {
                    if (route.layout) {
                        return (
                            <Route 
                                key={route.path} 
                                element={route.layout}
                            >
                                <Route 
                                    path={route.path} 
                                    element={
                                        <PrivateRoute allowedRoles={route.allowedRoles}>
                                            {route.element}
                                        </PrivateRoute>
                                    } 
                                />
                                {route.children && route.children.map((childRoute) => (
                                    <Route 
                                        key={`${route.path}-${childRoute.path}`} 
                                        path={`${route.path}/${childRoute.path}`}
                                        element={
                                            <PrivateRoute allowedRoles={childRoute.allowedRoles}>
                                                {childRoute.element}
                                            </PrivateRoute>
                                        } 
                                    />
                                ))}
                            </Route>
                        );
                    }
                    return (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={route.element} 
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default App;