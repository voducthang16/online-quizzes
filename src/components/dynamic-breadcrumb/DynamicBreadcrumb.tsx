import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';
import { Link } from "react-router";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

export const DynamicBreadcrumb = () => {
    const breadcrumbs = useBreadcrumbs();

    return (
        <Breadcrumb className="mb-3">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/" className="flex items-center">
                            <Home className="h-4 w-4" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                
                {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={crumb.path}>
                        <BreadcrumbSeparator />
                        {index === breadcrumbs.length - 1 ? (
                            <BreadcrumbPage>
                                <div className="flex items-center">
                                    {crumb.icon && <crumb.icon className="h-4 w-4 mr-2" />}
                                    {crumb.title}
                                </div>
                            </BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <Link to={crumb.path} className="flex items-center">
                                    {crumb.icon && <crumb.icon className="h-4 w-4 mr-2" />}
                                    {crumb.title}
                                </Link>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
