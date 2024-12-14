import { z } from 'zod';
import { SubjectModel } from "@/models";
import { useForm } from 'react-hook-form';
import { Pencil, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const subjectFormSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    description: z.string().min(3, { message: "Description must be at least 3 characters." }),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
    subject?: SubjectModel;
    onSubmit: (data: SubjectFormValues) => void;
}

export const SubjectForm: FC<SubjectFormProps> = ({ subject, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: subject ? {
            name: subject.name,
            description: subject.description,
        } : {
            name: '',
            description: '',
        }
    });

    useEffect(() => {
        if (!isDialogOpen) {
            form.reset(subject ? {
                name: subject.name,
                description: subject.description,
            } : {
                name: '',
                description: '',
            });
        }
    }, [isDialogOpen, form, subject]);

    const handleSubmit = (data: SubjectFormValues) => {
        onSubmit(data);
        onClose();
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
                            name="name"
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
                            <Button type="submit">
                                {subject ? 'Update Subject' : 'Create Subject'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
