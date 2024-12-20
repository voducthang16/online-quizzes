import { z } from 'zod';
import { toast } from 'sonner';
import { ExamApi, SubjectApi, ClassApi } from '@/api/page';
import { ExamModel, SubjectModel, ClassModel } from "@/models";
import { useForm } from 'react-hook-form';
import { Pencil, Plus, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from '@/stores';

const examFormSchema = z.object({
    exam_name: z.string()
        .min(3, { message: "Exam name must be at least 3 characters." })
        .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/, {
            message: "Exam name can only contain letters and spaces"
        })
        .trim(),
    subject_id: z.number().min(1, "Subject is required"),
    class_id: z.number().min(1, "Class is required"),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;

interface ExamFormProps {
    exam?: ExamModel;
    onSubmit: () => void;
}

export const ExamForm: FC<ExamFormProps> = ({ exam, onSubmit }) => {
    const { userInfo } = useUserStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subjects, setSubjects] = useState<SubjectModel[]>([]);
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [examDetail, setExamDetail] = useState<ExamModel | null>(null);
    const [isLoading, setIsLoading] = useState({
        subjects: false,
        classes: false,
        examDetail: false
    });

    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examFormSchema),
        // Initialize with empty values, we'll set them after data is loaded
        defaultValues: {
            exam_name: '',
            subject_id: undefined,
            class_id: undefined,
            duration: 30,
        }
    });

    const fetchExamDetail = async () => {
        if (!exam?.exam_id) return;
        
        try {
            setIsLoading(prev => ({ ...prev, examDetail: true }));
            const response = await ExamApi.getDetailExam(exam.exam_id);
            if (response.data) {
                const data = response.data.data;
                setExamDetail(data);
                // Update form values after data is loaded
                form.reset({
                    exam_name: data.exam_name,
                    subject_id: data.subject_id,
                    class_id: data.class_id,
                    duration: data.duration,
                }, { keepDefaultValues: true });
            }
        } catch (error: any) {
            toast.error('Failed to load exam details', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, examDetail: false }));
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(prev => ({ ...prev, subjects: true, classes: true }));
            const [subjectsResponse, classesResponse] = await Promise.all([
                SubjectApi.getAllSubjects(),
                ClassApi.getAllClasses()
            ]);

            if (subjectsResponse.data?.data) {
                setSubjects(subjectsResponse.data.data);
            }
            if (classesResponse.data?.data) {
                setClasses(classesResponse.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load data', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, subjects: false, classes: false }));
        }
    };

    // Handle dialog open/close and data fetching
    useEffect(() => {
        if (isDialogOpen) {
            // Reset form when opening
            form.reset({
                exam_name: '',
                subject_id: undefined,
                class_id: undefined,
                duration: 30,
            });
            
            // Fetch necessary data
            fetchData();
            
            // If editing, fetch exam details
            if (exam) {
                fetchExamDetail();
            }
        }
    }, [isDialogOpen]);

    const handleSubmit = async (data: ExamFormValues) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const submitAction = exam 
                ? ExamApi.updateExam({
                    payload: {
                        exam_id: exam.exam_id,
                        ...data,
                        questions: examDetail?.questions || []
                    }
                })
                : ExamApi.createExam({ 
                    payload: { 
                        ...data, 
                        created_by: userInfo.user_id, 
                        questions: [] 
                    } 
                });

            const response = await submitAction;

            if (!response.data.code) {
                toast.success(exam ? 'Exam Updated' : 'Exam Created', {
                    description: `${data.exam_name} has been ${exam ? 'updated' : 'created'} successfully.`
                });

                onSubmit();
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process exam operation.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoadingInitialData = isLoading.subjects || isLoading.classes || (exam && isLoading.examDetail);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {exam ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-gray-200 flex items-center w-8 h-8"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Add Exam
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {exam ? 'Edit Exam' : 'Create New Exam'}
                    </DialogTitle>
                </DialogHeader>

                {isLoadingInitialData ? (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="exam_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exam Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter exam name" 
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subject_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <Select 
                                            onValueChange={(v) => field.onChange(Number(v))} 
                                            value={field.value?.toString()}
                                            disabled={isLoading.subjects || isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a subject" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subjects.map((subject) => (
                                                    <SelectItem 
                                                        key={subject.subject_id} 
                                                        value={subject.subject_id.toString()}
                                                    >
                                                        {subject.subject_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="class_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <Select 
                                            onValueChange={(v) => field.onChange(Number(v))} 
                                            value={field.value?.toString()}
                                            disabled={isLoading.classes || isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classes.map((cls) => (
                                                    <SelectItem 
                                                        key={cls.class_id} 
                                                        value={cls.class_id.toString()}
                                                    >
                                                        {cls.class_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min={1} 
                                                {...field} 
                                                onChange={e => field.onChange(+e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
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
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {exam ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        exam ? 'Update Exam' : 'Create Exam'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};