import { FC, useEffect, useState } from 'react';
import { FilePlus } from 'lucide-react';
import { toast } from 'sonner';
import { ExamApi, BankApi } from '@/api/page';
import { Button } from "@/components/ui/button";
import { ExamModel, BankModel, QuestionModel } from "@/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamAddQuestionsProps {
    examData: ExamModel;
    onSubmit: () => void;
}

export const ExamAddQuestions: FC<ExamAddQuestionsProps> = ({ examData, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState<string>();
    const [banks, setBanks] = useState<BankModel[]>([]);
    const [bankQuestions, setBankQuestions] = useState<QuestionModel[]>([]);
    const [examDetail, setExamDetail] = useState<ExamModel>();
    const [selectedQuestions, setSelectedQuestions] = useState<QuestionModel[]>([]);
    const [isLoading, setIsLoading] = useState({
        banks: false,
        questions: false,
        examDetail: false
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchExamDetail = async () => {
        try {
            setIsLoading(prev => ({ ...prev, examDetail: true }));
            const response = await ExamApi.getDetailExam(examData.exam_id);
            if (response.data) {
                setExamDetail(response.data.data);
                setSelectedQuestions((response.data.data.questions || []) as QuestionModel[]);
            }
        } catch (error: any) {
            toast.error('Failed to load exam details', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, examDetail: false }));
        }
    };

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                fetchBanks(),
                fetchExamDetail()
            ]);
        }
    }, [isOpen]);

    const fetchBanks = async () => {
        try {
            setIsLoading(prev => ({ ...prev, banks: true }));
            const response = await BankApi.getAllBanks();
            if (response.data) {
                setBanks(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load banks', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, banks: false }));
        }
    };

    const fetchBankQuestions = async (bankId: number) => {
        try {
            setIsLoading(prev => ({ ...prev, questions: true }));
            const response = await BankApi.getBankDetail(bankId);
            if (response.data) {
                setBankQuestions(response.data.data.questions || []);
            }
        } catch (error: any) {
            toast.error('Failed to load questions', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, questions: false }));
        }
    };

    useEffect(() => {
        if (selectedBank) {
            fetchBankQuestions(+selectedBank);
        }
    }, [selectedBank]);

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            await ExamApi.updateExam({
                payload: {
                    exam_id: examData.exam_id,
                    ...examDetail,
                    questions: selectedQuestions.map(q => ({ question_id: q.question_id}))
                }
            });

            toast.success('Questions Updated', {
                description: 'Exam questions have been updated successfully.'
            });

            onSubmit();
            setIsOpen(false);
        } catch (error: any) {
            toast.error('Failed to update questions', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8"
                >
                    <FilePlus className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Manage Questions</SheetTitle>
                    <SheetDescription>
                        Add or remove questions for {examData.exam_name}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    <div className="space-y-6">
                        <div>
                            <Select onValueChange={setSelectedBank} value={selectedBank}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a question bank" />
                                </SelectTrigger>
                                <SelectContent>
                                    {banks.map((bank) => (
                                        <SelectItem key={bank.question_bank_id} value={bank.question_bank_id.toString()}>
                                            {bank.bank_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">
                                Selected Questions ({selectedQuestions.length})
                            </h3>
                            <ScrollArea className="h-[200px] rounded-md border p-4">
                                {selectedQuestions.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedQuestions.map((question) => (
                                            <div 
                                                key={`selected-${question.question_id}`}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex-1 pr-4">
                                                    <p className="font-medium truncate max-w-[210px]">{question.question}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setSelectedQuestions(current => 
                                                            current.filter(q => q.question_id !== question.question_id)
                                                        );
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">
                                        No questions selected
                                    </p>
                                )}
                            </ScrollArea>
                        </div>
                        {selectedBank && (
                            <div>
                                <h3 className="text-sm font-medium mb-2">
                                    Available Questions ({bankQuestions.length - selectedQuestions.length})
                                </h3>
                                <ScrollArea className="h-[200px] rounded-md border p-4">
                                    {isLoading.questions ? (
                                        <div className="flex justify-center items-center h-full">
                                            Loading questions...
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {bankQuestions
                                                .filter(question => 
                                                    !selectedQuestions.some(q => q.question_id === question.question_id)
                                                )
                                                .map((question) => (
                                                    <div 
                                                        key={`available-${question.question_id}`}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex-1 pr-4">
                                                            <p className="font-medium truncate max-w-[220px]">{question.question}</p>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedQuestions(current => [...current, question]);
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        )}
                        <div className="flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsOpen(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveChanges}
                                disabled={isSaving || selectedQuestions.length === 0}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};