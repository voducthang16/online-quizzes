import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const SplashScreen = () => {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true)
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
            <div className={`text-center text-gray-800 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="mb-8">
                    <svg
                        className="w-24 h-24 mx-auto"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="#4A5568"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 17L12 22L22 17"
                            stroke="#4A5568"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 12L12 17L22 12"
                            stroke="#4A5568"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4">Welcome to MyApp</h1>
                <p className="text-xl mb-8">Loading your experience...</p>
                <Loader2 className="animate-spin w-8 h-8 mx-auto" />
            </div>
        </div>
    )
};
