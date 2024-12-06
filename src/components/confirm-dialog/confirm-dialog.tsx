import { FC, ReactNode } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export enum ConfirmDialogType {
    Destructive = 'destructive',
    Warning = 'warning',
    Info = 'info',
    Success = 'success'
}

export interface ConfirmDialogConfig {
    type?: ConfirmDialogType;
    title: string;
    description: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
}

export interface ConfirmDialogProps extends ConfirmDialogConfig {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
    const {
        open,
        onOpenChange,
        onConfirm,
        onCancel,
        type = ConfirmDialogType.Destructive,
        title,
        description,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
    } = props;

    const getDialogIcon = () => {
        const iconProps = { className: "h-6 w-6 mr-2" };
        switch (type) {
            case ConfirmDialogType.Destructive:
                return <AlertTriangle {...iconProps} className={`${iconProps.className} text-destructive`} />;
            case ConfirmDialogType.Warning:
                return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
            case ConfirmDialogType.Success:
                return <CheckCircle2 {...iconProps} className={`${iconProps.className} text-green-500`} />;
            case ConfirmDialogType.Info:
            default:
                return <AlertCircle {...iconProps} className={`${iconProps.className} text-blue-500`} />;
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onOpenChange?.(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    return (
        <AlertDialog 
            open={open} 
            onOpenChange={(isOpen) => {
                onOpenChange?.(isOpen);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        {getDialogIcon()}
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
