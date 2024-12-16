import { BankApi } from "@/api/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankModel } from "@/models";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const ImportDialog = ({ isOpen, onClose, onSubmit }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (bankId: number, file: File) => void;
}) => {
    const [selectedBank, setSelectedBank] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [banks, setBanks] = useState<BankModel[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchBanks = async () => {
        try {
            setIsLoading(true);
            const response = await BankApi.getAllBanks();
            if (response.data) {
                setBanks(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load banks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchBanks();
        }
    }, [isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && selectedBank) {
            onSubmit(+selectedBank, file);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Questions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Question Bank</Label>
                        <Select 
                            onValueChange={setSelectedBank} 
                            value={selectedBank}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={isLoading ? "Loading..." : "Select a bank"} />
                            </SelectTrigger>
                            <SelectContent>
                                {banks.map((bank) => (
                                    <SelectItem
                                        key={bank.question_bank_id}
                                        value={bank.question_bank_id as any}
                                    >
                                        {bank.bank_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Upload CSV File</Label>
                        <Input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={!selectedBank}
                        />
                        <p className="text-sm text-muted-foreground">
                            File must be in CSV format with columns: question, answers, correct_answer
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
