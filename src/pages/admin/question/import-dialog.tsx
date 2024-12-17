import { BankApi, QuestionListApi } from "@/api/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankModel } from "@/models";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const ImportDialog = ({ isOpen, onClose, onSubmit }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}) => {
    const [selectedBank, setSelectedBank] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [banks, setBanks] = useState<BankModel[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchBanks = async () => {
        try {
            setIsLoading(true);
            const response = await BankApi.getAllBanks();
            if (response.data) {
                setBanks(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load banks', {
                description: error?.message || 'Please try again'
            });
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
        if (file) {
            // Validate file type
            const allowedTypes = ['.csv', '.xlsx', '.xls'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            
            if (!allowedTypes.includes(fileExtension)) {
                toast.error('Invalid file type', {
                    description: 'Please upload a CSV or Excel file'
                });
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedBank) {
            toast.error('Please select a bank and a file');
            return;
        }

        setIsUploading(true);
        try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = async () => {
                const base64File = fileReader.result?.toString().split(',')[1];

                console.log(base64File);

                if (!base64File) {
                    toast.error('Failed to read file');
                    setIsUploading(false);
                    return;
                }

                try {
                    const response = await QuestionListApi.uploadQuestions({
                        user_id: 6, // Replace with actual user ID from authentication
                        question_bank_id: +selectedBank,
                        question: base64File
                    });

                    toast.success('Questions uploaded successfully', {
                        description: `${selectedFile.name} has been processed`
                    });

                    // Call onSubmit if provided
                    onSubmit?.();

                    // Reset form
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    onClose();
                } catch (uploadError: any) {
                    toast.error('Upload failed', {
                        description: uploadError?.response?.data?.message || 
                                     uploadError?.message || 
                                     'Unable to upload questions'
                    });
                }
            };
        } catch (error: any) {
            toast.error('File processing failed', {
                description: error?.message || 'Unable to process file'
            });
        } finally {
            setIsUploading(false);
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
                        <Label>Upload File</Label>
                        <Input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={!selectedBank}
                        />
                        <p className="text-sm text-muted-foreground">
                            File must be in CSV or Excel format with columns: 
                            question, answer A, answer B, answer C, answer D, correct answer
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline" 
                        onClick={onClose}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || !selectedBank || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};