import { routes } from '@/routes';
import { useLocation } from 'react-router';

interface BreadcrumbItem {
    title: string;
    path: string;
    icon?: any;
}

export const useBreadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);

    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const breadcrumbs: BreadcrumbItem[] = [];
        let currentPath = '';

        for (const name of pathnames) {
            currentPath += `/${name}`;
            const route = findRoute(currentPath);
            if (route) {
                breadcrumbs.push({
                    title: route.title || name,
                    path: currentPath,
                    icon: route.icon
                });
            }
        }

        return breadcrumbs;
    };

    const findRoute = (path: string): any => {
        const normalizedPath = path.replace(/^\/+/, '');
        const pathSegments = normalizedPath.split('/');

        const findNestedRoute = (routesArray: any[], targetSegments: string[], parentPath: string = ''): any => {
            for (const route of routesArray) {
                const fullRoutePath = parentPath
                    ? `${parentPath}/${route.path}`
                    : route.path;

                const routeSegments = fullRoutePath.split('/').filter(Boolean);

                if (matchSegments(routeSegments, targetSegments)) {
                    return route;
                }

                if (route.children) {
                    const found = findNestedRoute(route.children, targetSegments, fullRoutePath);
                    if (found) return found;
                }
            }
            return null;
        };

        return findNestedRoute(routes, pathSegments);
    };

    const matchSegments = (routeSegments: string[], pathSegments: string[]): boolean => {
        if (routeSegments.length !== pathSegments.length) return false;

        return routeSegments.every((seg, i) => {
            if (seg.startsWith(':')) {
                return true;
            }
            return seg === pathSegments[i];
        });
    };

    return getBreadcrumbs();
};
