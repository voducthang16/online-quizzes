import { BankApi, QuestionListApi } from "@/api/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankModel } from "@/models";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores";
import { Download } from "lucide-react";

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
    const { userInfo } = useUserStore();

    const fetchBanks = async () => {
        try {
            setIsLoading(true);
            const param = userInfo?.role === 'admin' ? {} : { teacher_id: userInfo?.user_id };
            const response = await BankApi.getAllBanks({
                payload: param
            });
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
            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (fileExtension !== 'xlsx') {
                toast.error('Invalid file type', {
                    description: 'Please upload an Excel (.xlsx) file'
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleDownloadExample = () => {
        const link = document.createElement('a');
        link.href = '/questions_template.xlsx';
        link.download = 'questions_template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Template downloaded', {
            description: 'Use this template to format your questions'
        });
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedBank) {
            toast.error('Please select a question bank and a file');
            return;
        }

        setIsUploading(true);
        try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = async () => {
                const base64File = fileReader.result?.toString().split(',')[1];

                if (!base64File) {
                    toast.error('Failed to read file');
                    setIsUploading(false);
                    return;
                }

                try {
                    const response = await QuestionListApi.uploadQuestions({
                        user_id: userInfo?.user_id,
                        question_bank_id: +selectedBank,
                        question: base64File
                    });

                    toast.success('Questions uploaded successfully', {
                        description: `${selectedFile.name} has been processed`
                    });

                    onSubmit?.();
                    handleClose();
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

    const handleClose = () => {
        setSelectedFile(null);
        setSelectedBank(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
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
                                <SelectValue placeholder={isLoading ? "Loading..." : "Select a question bank"} />
                            </SelectTrigger>
                            <SelectContent>
                                {banks.map((bank) => (
                                    <SelectItem
                                        key={bank.question_bank_id}
                                        value={bank.question_bank_id.toString()}
                                    >
                                        {bank.bank_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Upload File</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadExample}
                                className="h-8"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Template
                            </Button>
                        </div>
                        <Input
                            type="file"
                            accept=".xlsx"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={!selectedBank}
                        />
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>File requirements:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Excel format (.xlsx)</li>
                                <li>Required columns: Question, A, B, C, D, Answer</li>
                                <li>Answer column should contain the correct option letter (A, B, C, or D)</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
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