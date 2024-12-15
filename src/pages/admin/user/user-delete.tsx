import { FC, useState } from 'react';
import { UserModel } from "@/models";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ConfirmDialogType } from '@/components';

interface DeleteUserDialogProps {
    user: UserModel;
    onDelete: (userId: string) => void;
}

export const DeleteUserDialog: FC<DeleteUserDialogProps> = ({ 
    user, 
    onDelete, 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete(user.id);
        setIsOpen(false);
    };

    return (
        <>
            <Button
                size="sm"
                variant="destructive"
                className="w-8 h-8"
                onClick={() => setIsOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            <ConfirmDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Confirm Action"
                description={<>
                    Are you sure you want to delete the class:
                    <div className="my-2 p-2 bg-muted rounded">
                        <div><strong>Name:</strong> {user.full_name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Role:</strong> {user.role}</div>
                    </div>
                    This action cannot be undone.
                </>}
                type={ConfirmDialogType.Destructive}
                onConfirm={handleDelete}
            />
        </>
    );
};
