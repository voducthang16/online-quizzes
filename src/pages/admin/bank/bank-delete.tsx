import { FC, useState } from 'react';
import { BankModel } from "@/models";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ConfirmDialogType } from '@/components';

interface DeleteBankDialogProps {
    bank: BankModel;
    onDelete: (bankId: number) => void;
}

export const DeleteBankDialog: FC<DeleteBankDialogProps> = ({ 
    bank, 
    onDelete 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete(bank.question_bank_id);
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
                    Are you sure you want to delete the bank:
                    <div className="my-2 p-2 bg-muted rounded">
                        <div><strong>Name:</strong> {bank.bank_name}</div>
                        <div><strong>Status:</strong> {bank.is_public ? 'Public' : 'Private'}</div>
                        <div><strong>Created By:</strong> {bank.created_by?.full_name}</div>
                    </div>
                    This action cannot be undone.
                </>}
                type={ConfirmDialogType.Destructive}
                onConfirm={handleDelete}
            />
        </>
    );
};