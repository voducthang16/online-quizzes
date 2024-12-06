import { FC, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ClassModel } from "@/models";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ConfirmDialogType } from '@/components';

interface DeleteClassDialogProps {
    class: ClassModel;
    onDelete: (classId: string) => void;
}

export const DeleteClassDialog: FC<DeleteClassDialogProps> = (props) => {
    const { class: classData, onDelete } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        onDelete(classData.id);
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
                        <div><strong>Name:</strong> {classData.name}</div>
                        <div><strong>Subject ID:</strong> {classData.subjectId}</div>
                        <div><strong>Teacher ID:</strong> {classData.teacherId}</div>
                    </div>
                    This action cannot be undone.
                </>}
                type={ConfirmDialogType.Destructive}
                onConfirm={handleConfirm}
            />
        </>
    );
};
