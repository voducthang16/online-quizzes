import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Unauthorized Access</h1>
                <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page.</p>
                <Button asChild>
                    <Link to="/">
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    )
};
