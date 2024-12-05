import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
                <Button asChild>
                    <Link to="/">
                        Go back home
                    </Link>
                </Button>
            </div>
        </div>
    )
};
