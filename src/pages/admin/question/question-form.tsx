import { z } from 'zod';
import { toast } from 'sonner';
import { QuestionModel } from "@/models";
import { useForm } from 'react-hook-form';
import { FC, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BANK_LIST } from '@/constants/fake-data';
import { Pencil, Plus, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const questionFormSchema = z.object({
    content: z.string().min(5, "Question content must be at least 5 characters long."),
    answer: z.array(z.string()).min(2, "Must have at least 2 answers"),
    correctAnswer: z.string().min(1, "Must select correct answer"),
    bankId: z.string().min(1, "Bank is required"),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
    question?: QuestionModel;
    onSubmit: (data: QuestionFormValues) => void;
    isHideImport?: boolean;
}

export const QuestionForm: FC<QuestionFormProps> = ({ question, onSubmit, isHideImport = false }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [answers, setAnswers] = useState<string[]>(question?.answer || ['', '', '', '']);

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: question ? {
            content: question.content,
            answer: question.answer,
            correctAnswer: question.correctAnswer,
            bankId: question.bankId,
        } : {
            content: '',
            answer: ['', '', '', ''],
            correctAnswer: '',
            bankId: '',
        }
    });

    const handleSubmit = (data: QuestionFormValues) => {
        onSubmit({
            ...data,
            answer: answers.filter(a => a.trim() !== '')
        });
        setIsDialogOpen(false);
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
                                name="content"
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
                                name="bankId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a bank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {BANK_LIST.map((bank) => (
                                                    <SelectItem key={bank.id} value={bank.id}>
                                                        {bank.name}
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
                                {answers.map((answer, index) => (
                                    <Input
                                        key={index}
                                        value={answer}
                                        onChange={(e) => {
                                            const newAnswers = [...answers];
                                            newAnswers[index] = e.target.value;
                                            setAnswers(newAnswers);
                                            form.setValue('answer', newAnswers);
                                        }}
                                        placeholder={`Answer ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <FormField
                                control={form.control}
                                name="correctAnswer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correct Answer</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select correct answer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {answers.map((answer, index) => (
                                                    answer.trim() && (
                                                        <SelectItem key={index} value={answer}>
                                                            {answer}
                                                        </SelectItem>
                                                    )
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
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {question ? 'Update Question' : 'Create Question'}
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