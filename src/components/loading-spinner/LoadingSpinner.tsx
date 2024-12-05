import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin w-12 h-12 text-blue-300" />
    </div>
);
