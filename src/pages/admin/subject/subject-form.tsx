import { z } from 'zod';
import { toast } from 'sonner';
import { SubjectModel } from "@/models";
import { SubjectApi } from '@/api/page';
import { useForm } from 'react-hook-form';
import { Pencil, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const subjectFormSchema = z.object({
    subject_name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    description: z.string().min(3, { message: "Description must be at least 3 characters." }),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
    subject?: SubjectModel;
    onSubmit: (data: SubjectFormValues) => void;
}

export const SubjectForm: FC<SubjectFormProps> = ({ subject, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: subject ? {
            subject_name: subject.subject_name,
            description: subject.description,
        } : {
            subject_name: '',
            description: '',
        }
    });

    useEffect(() => {
        if (!isDialogOpen) {
            form.reset(subject ? {
                subject_name: subject.subject_name,
                description: subject.description,
            } : {
                subject_name: '',
                description: '',
            });
        }
    }, [isDialogOpen, form, subject]);

    const handleSubmit = async (data: SubjectFormValues) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const submitAction = subject 
                ? SubjectApi.updateSubject({ payload: { subject_id: subject.subject_id, ...data } })
                : SubjectApi.createSubject({ payload: data });

            const response = await submitAction;

            if (!response.data.code) {
                toast.success(subject ? 'Subject Updated' : 'Subject Created', {
                    description: `${data.subject_name} has been ${subject ? 'updated' : 'created'} successfully.`
                });

                onSubmit(response.data.data);
                onClose();
            }
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process subject operation.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onClose = () => {
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {subject ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-gray-200 flex items-center w-8 h-8"
                    >
                        <Pencil />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="h-4 w-4" /> Add Subject
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {subject ? 'Edit Subject' : 'Create New Subject'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subject_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => onClose()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (subject ? 'Update Subject' : 'Create Subject')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
