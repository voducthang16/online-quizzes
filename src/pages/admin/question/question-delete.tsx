import { FC, useState } from 'react';
import { QuestionModel } from "@/models";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ConfirmDialogType } from '@/components';

interface DeleteQuestionDialogProps {
    question: QuestionModel;
    onDelete: (questionId: string) => void;
}

export const DeleteQuestionDialog: FC<DeleteQuestionDialogProps> = ({ 
    question, 
    onDelete 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete(question.id);
        setIsOpen(false);
    };

    const truncateContent = (content: string, maxLength = 100) => {
        return content.length > maxLength 
            ? content.substring(0, maxLength) + '...'
            : content;
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
                title="Confirm Delete Question"
                description={<>
                    Are you sure you want to delete this question:
                    <div className="my-2 p-2 bg-muted rounded">
                        <div><strong>Question:</strong> {truncateContent(question.content)}</div>
                        <div><strong>Bank:</strong> {question.bank?.name}</div>
                        <div><strong>Correct Answer:</strong> {question.correctAnswer}</div>
                    </div>
                    This action cannot be undone.
                </>}
                type={ConfirmDialogType.Destructive}
                onConfirm={handleDelete}
            />
        </>
    );
};