import { z } from 'zod';
import { toast } from 'sonner';
import { BankApi, QuestionListApi } from '@/api/page';
import { BankModel, QuestionModel } from "@/models";
import { useForm } from 'react-hook-form';
import { FC, useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImportDialog } from './import-dialog';
import { useUserStore } from '@/stores';

interface AnswerOption {
    key: 'A' | 'B' | 'C' | 'D';
    value: string;
}

const questionFormSchema = z.object({
    question: z.string()
        .min(5, "Question content must be at least 5 characters long.")
        .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/, {
            message: "Question can only contain letters and spaces"
        })
        .trim(),
    question_bank_id: z.number().min(1, "Bank is required"),
    correct_answer: z.enum(['A', 'B', 'C', 'D'], { 
        errorMap: () => ({ message: "Must select correct answer" }) 
    }),
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
            ? JSON.parse(question.answer).map((ans: any) => ({
                key: ans.key,
                value: ans.value
            }))
            : [
                { key: 'A', value: '' },
                { key: 'B', value: '' },
                { key: 'C', value: '' },
                { key: 'D', value: '' }
            ]
    );
    const [banks, setBanks] = useState<BankModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

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
        if (isDialogOpen) {
            fetchBanks();
        }
    }, [isDialogOpen]);

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: question ? {
            question: question.question,
            question_bank_id: question.question_bank_id,
            correct_answer: question.correct_answer as 'A' | 'B' | 'C' | 'D',
        } : {
            question: '',
            question_bank_id: undefined,
            correct_answer: 'A',
        }
    });

    const handleSubmit = async (data: QuestionFormValues) => {
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            const answersJson = JSON.stringify(answers);
            const parsedAnswers = JSON.parse(answersJson);

            if (!Array.isArray(parsedAnswers)) {
                toast.error('Validation Error', {
                    description: 'Invalid answer format.'
                });
                return;
            }

            const validAnswers = parsedAnswers.filter((ans: AnswerOption) => 
                ans.value && ans.value.trim() !== ''
            );

            if (validAnswers.length < 4) {
                toast.error('Validation Error', {
                    description: 'Please provide at least four answer options.'
                });
                return;
            }

            const selectedAnswerValue = validAnswers.find(
                (ans: AnswerOption) => ans.key === data.correct_answer
            );

            if (!selectedAnswerValue) {
                toast.error('Validation Error', {
                    description: 'Selected answer cannot be empty.'
                });
                return;
            }

            const submitAction = question
                ? QuestionListApi.updateQuestion({
                    payload: {
                        question_id: question.question_id,
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

    const handleImport = () => {
        onSubmit();
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
                                <FormLabel>Answers</FormLabel>
                                {['A', 'B', 'C', 'D'].map((key, index) => (
                                    <div key={key} className="flex gap-2 items-center">
                                        <div className="w-10 font-bold text-center">{key}</div>
                                        <Input
                                            value={answers[index].value}
                                            onChange={(e) => {
                                                const newAnswers = [...answers];
                                                newAnswers[index] = {
                                                    ...newAnswers[index],
                                                    value: e.target.value
                                                };
                                                setAnswers(newAnswers);
                                            }}
                                            placeholder={`Enter answer ${key}`}
                                        />
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
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select correct answer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['A', 'B', 'C', 'D'].map(key => (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                        disabled={!answers.find(ans => ans.key === key)?.value.trim()}
                                                    >
                                                        {`${key} - ${answers.find(ans => ans.key === key)?.value || ''}`}
                                                    </SelectItem>
                                                ))}
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
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setIsImportOpen(true)}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Import CSV
                        </Button>
                        <ImportDialog
                            isOpen={isImportOpen}
                            onClose={() => setIsImportOpen(false)}
                            onSubmit={handleImport}
                        />
                    </>
                )}
            </Dialog>
        </div>
    );
};