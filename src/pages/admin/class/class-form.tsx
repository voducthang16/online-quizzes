import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Pencil, Plus, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClassApi, SubjectApi, UserApi } from '@/api/page';
import { ClassModel, SubjectModel, UserModel } from "@/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const classFormSchema = z.object({
    class_name: z.string()
        .min(2, "Class name must be at least 2 characters long.")
        .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/, {
            message: "Class name can only contain letters and spaces"
        })
        .trim(),
    subject_id: z.number().int().min(1, "Subject is required"),
    teacher_id: z.number().int().min(1, "Teacher is required"),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
    class?: ClassModel;
    onSubmit: () => void;
}

export const ClassForm: FC<ClassFormProps> = ({ class: classData, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teachers, setTeachers] = useState<UserModel[]>([]);
    const [subjects, setSubjects] = useState<SubjectModel[]>([]);
    const [classDetail, setClassDetail] = useState<ClassModel | null>(null);
    const [isLoading, setIsLoading] = useState({
        teachers: false,
        subjects: false,
        classDetail: false
    });

    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classFormSchema),
        // Don't set default values here, we'll set them after data is loaded
        defaultValues: {
            class_name: '',
            subject_id: undefined,
            teacher_id: undefined,
        }
    });

    const fetchClassDetail = async () => {
        if (!classData?.class_id) return;

        try {
            setIsLoading(prev => ({ ...prev, classDetail: true }));
            const response = await ClassApi.getDetail(classData.class_id);
            if (response.data) {
                const data = response.data.data;
                setClassDetail(data);
                // Update form values after data is loaded
                form.reset({
                    class_name: data.class_name,
                    subject_id: data.subject_id,
                    teacher_id: data.teacher_id,
                }, { keepDefaultValues: true });
            }
        } catch (error: any) {
            toast.error('Failed to load class details', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, classDetail: false }));
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(prev => ({
                ...prev,
                teachers: true,
                subjects: true
            }));

            const [teachersResponse, subjectsResponse] = await Promise.all([
                UserApi.getAllTeachers(),
                SubjectApi.getAllSubjects()
            ]);

            if (teachersResponse.data) {
                setTeachers(teachersResponse.data.data);
            }
            if (subjectsResponse.data) {
                setSubjects(subjectsResponse.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load data', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({
                ...prev,
                teachers: false,
                subjects: false
            }));
        }
    };

    // Handle dialog open/close
    useEffect(() => {
        if (isDialogOpen) {
            // Reset form when opening
            form.reset({
                class_name: '',
                subject_id: undefined,
                teacher_id: undefined,
            });
            
            // Fetch necessary data
            fetchData();
            
            // If editing, fetch class details
            if (classData) {
                fetchClassDetail();
            }
        }
    }, [isDialogOpen]);

    const handleSubmit = async (data: ClassFormValues) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const submitAction = classData
                ? ClassApi.updateClass({
                    payload: {
                        class_id: classData.class_id,
                        students: classDetail?.students?.map(s => ({ student_id: s.user_id })) || [],
                        ...data
                    }
                })
                : ClassApi.createClass({ payload: data });

            const response = await submitAction;

            if (response.data) {
                toast.success(classData ? 'Class Updated' : 'Class Created', {
                    description: `${data.class_name} has been ${classData ? 'updated' : 'created'} successfully.`
                });

                onSubmit();
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process class operation.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoadingInitialData = isLoading.teachers || isLoading.subjects || (classData && isLoading.classDetail);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {classData ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-gray-200 flex items-center w-8 h-8"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Add Class
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {classData ? 'Edit Class' : 'Create New Class'}
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
                                name="class_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter class name" {...field} />
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
                                            disabled={isLoading.subjects}
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
                                name="teacher_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teacher</FormLabel>
                                        <Select 
                                            onValueChange={(v) => field.onChange(Number(v))} 
                                            value={field.value?.toString()}
                                            disabled={isLoading.teachers}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a teacher" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers.map((teacher) => (
                                                    <SelectItem 
                                                        key={teacher.user_id} 
                                                        value={teacher.user_id.toString()}
                                                    >
                                                        {teacher.full_name}
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
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {classData ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        classData ? 'Update Class' : 'Create Class'
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