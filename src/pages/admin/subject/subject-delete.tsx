import { FC, useState } from 'react';
import { SubjectModel } from "@/models";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ConfirmDialogType } from '@/components';

interface DeleteSubjectDialogProps {
    subject: SubjectModel;
    onDelete: (subjectId: number) => void;
}

export const DeleteSubjectDialog: FC<DeleteSubjectDialogProps> = ({ 
    subject, 
    onDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete(subject.subject_id);
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
                    Are you sure you want to delete the subject:
                    <div className="my-2 p-2 bg-muted rounded">
                        <div><strong>Name:</strong> {subject.subject_name}</div>
                        <div><strong>Description:</strong> {subject.description}</div>
                    </div>
                    This action cannot be undone.
                </>}
                type={ConfirmDialogType.Destructive}
                onConfirm={handleDelete}
            />
        </>
    );
};
