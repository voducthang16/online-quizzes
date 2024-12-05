import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { UserModel } from "@/models";

interface DeleteUserDialogProps {
    user: UserModel;
    onDelete: (userId: string) => void;
    disabled?: boolean;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ 
    user, 
    onDelete, 
    disabled = false 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete(user.id);
        setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={disabled}
                    className="flex items-center w-8 h-8"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                        Delete User Confirmation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the user:
                        <div className="my-2 p-2 bg-muted rounded">
                            <div><strong>Name:</strong> {user.fullName}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Role:</strong> {user.role}</div>
                        </div>
                        This action cannot be undone. The user will be permanently removed from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
