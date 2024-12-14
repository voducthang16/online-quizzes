import { FC, useState } from 'react';
import { ExamModel } from "@/models";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ConfirmDialogType } from '@/components';

interface DeleteExamDialogProps {
    exam: ExamModel;
    onDelete: (examId: string) => void;
}

export const DeleteExamDialog: FC<DeleteExamDialogProps> = ({ exam, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

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
                title="Delete Exam"
                description={<>
                    Are you sure you want to delete this exam:
                    <div className="my-2 p-2 bg-muted rounded">
                        <div><strong>Name:</strong> {exam.name}</div>
                        <div><strong>Subject:</strong> {exam.subject?.name}</div>
                        <div><strong>Class:</strong> {exam.class?.name}</div>
                        <div><strong>Questions:</strong> {exam.questions?.length}</div>
                    </div>
                    This action cannot be undone.
                </>}
                type={ConfirmDialogType.Destructive}
                onConfirm={() => {
                    onDelete(exam.id);
                    setIsOpen(false);
                }}
            />
        </>
    );
};