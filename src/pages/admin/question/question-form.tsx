import { z } from 'zod';
import { toast } from 'sonner';
import { BankApi, QuestionListApi } from '@/api/page';
import { BankModel, QuestionModel } from "@/models";
import { useForm } from 'react-hook-form';
import { FC, useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AnswerOption {
    id: number;
    value: string;
}

const questionFormSchema = z.object({
    question: z.string().min(5, "Question content must be at least 5 characters long."),
    question_bank_id: z.number().min(1, "Bank is required"),
    correct_answer: z.string().min(1, "Must select correct answer"),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
    question?: QuestionModel;
    onSubmit: () => void;
    isHideImport?: boolean;
}

export const QuestionForm: FC<QuestionFormProps> = ({ question, onSubmit, isHideImport = false }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [answers, setAnswers] = useState<AnswerOption[]>(
        question?.answer
            ? JSON.parse(question.answer).map((ans: string, idx: number) => ({
                id: idx + 1,
                value: ans
            }))
            : Array(4).fill('').map((_, idx) => ({
                id: idx + 1,
                value: ''
            }))
    );
    const [banks, setBanks] = useState<BankModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isDialogOpen) {
            fetchBanks();
        }
    }, [isDialogOpen]);

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: question ? {
            question: question.question,
            question_bank_id: question.question_bank_id,
            correct_answer: question.correct_answer,
        } : {
            question: '',
            question_bank_id: undefined,
            correct_answer: '',
        }
    });

    const handleSubmit = async (data: QuestionFormValues) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const validAnswers = answers.filter(a => a.value.trim() !== '');
            const answersJson = JSON.stringify(validAnswers.map(a => a.value));

            const submitAction = question
                ? QuestionListApi.updateQuestion({
                    payload: {
                        question_bank_id: question.question_bank_id,
                        ...data,
                        answer: answersJson
                    }
                })
                : QuestionListApi.createQuestion({
                    payload: {
                        ...data,
                        answer: answersJson
                    }
                });

            const response = await submitAction;

            if (!response.data.code) {
                toast.success(question ? 'Question Updated' : 'Question Created', {
                    description: `Question has been ${question ? 'updated' : 'created'} successfully.`
                });
                onSubmit();
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process question operation.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                // Prepare form data for API
                const formData = new FormData();
                formData.append('file', file);

                // TODO: Replace with actual API call
                // await uploadQuestionsCsv(formData);

                toast.success('Upload Successful', {
                    description: 'Questions have been imported'
                });
            } catch (error) {
                toast.error('Upload Failed', {
                    description: 'Unable to process file. Please try again.'
                });
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    return (
        <div className="flex justify-end space-x-5 items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    {question ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-gray-200 flex items-center w-8 h-8"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Add Question
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {question ? 'Edit Question' : 'Create New Question'}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Content</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter question content" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="question_bank_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank</FormLabel>
                                        <Select onValueChange={(v) => field.onChange(+v)} value={field.value as any}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={isLoading ? "Loading..." : "Select a bank"} />
                                                </SelectTrigger>
                                            </FormControl>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Answers</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newAnswer = {
                                                id: answers.length + 1,
                                                value: ''
                                            };
                                            setAnswers([...answers, newAnswer]);
                                        }}
                                    >
                                        Add Answer
                                    </Button>
                                </div>
                                {answers.map((answer, index) => (
                                    <div key={answer.id} className="flex gap-2">
                                        <Input
                                            value={answer.value}
                                            onChange={(e) => {
                                                const newAnswers = [...answers];
                                                newAnswers[index] = {
                                                    ...newAnswers[index],
                                                    value: e.target.value
                                                };
                                                setAnswers(newAnswers);
                                            }}
                                            placeholder={`Answer ${index + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="px-3"
                                            onClick={() => {
                                                const newAnswers = answers.filter((_, i) => i !== index);
                                                setAnswers(newAnswers);
                                            }}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormField
                                control={form.control}
                                name="correct_answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correct Answer</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={answers.length === 0}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select correct answer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {answers
                                                    .filter(answer => answer.value.trim() !== '')
                                                    .map(answer => (
                                                        <SelectItem
                                                            key={answer.id}
                                                            value={answer.value}
                                                        >
                                                            {answer.value}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : (question ? 'Update Question' : 'Create Question')
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
                {!isHideImport && (
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploading ? 'Uploading...' : 'Import CSV'}
                        </Button>
                    </div>
                )}
            </Dialog>
        </div>
    );
};