import { z } from 'zod';
import { toast } from 'sonner';
import { ROLE } from "@/constants";
import { UserApi } from '@/api/page';
import { UserModel } from "@/models";
import { useForm } from 'react-hook-form';
import { Pencil, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const userFormSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    role: z.nativeEnum(ROLE),
    full_name: z.string()
        .min(2, "Full name must be at least 2 characters long.")
        .regex(/^[a-zA-Z\s]*$/, {
            message: "Full name can only contain letters and spaces"
        })
        .trim(),
    password: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
    user?: UserModel;
    onSubmit: (data: UserFormValues) => void;
}

export const UserForm: FC<UserFormProps> = ({ user, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: user ? {
            email: user.email,
            role: user.role,
            full_name: user.full_name || '',
        } : {
            email: '',
            role: ROLE.STUDENT,
            full_name: '',
        }
    });

    useEffect(() => {
        if (!isDialogOpen) {
            form.reset(user ? {
                email: user.email,
                role: user.role,
                full_name: user.full_name || '',
            } : {
                email: '',
                role: ROLE.STUDENT,
                full_name: '',
            });
        }
    }, [isDialogOpen, form, user]);

    const handleSubmit = async (data: UserFormValues) => {

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const submitAction = user 
                ? UserApi.updateUser({ payload: { user_id: user.user_id, ...data } })
                : UserApi.createUser({ 
                    payload: { 
                        ...data, 
                        password: user ? undefined : '123456' 
                    } 
                });

            const response = await submitAction;

            if (!response.data.code) {
                toast.success(user ? 'User Updated' : 'User Created', {
                    description: `${data.full_name} has been ${user ? 'updated' : 'created'} successfully.`
                });

                onSubmit(response.data.data);
                onClose();
            }
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process user operation.'
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
                {user ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-gray-200 flex items-center w-8 h-8"
                    >
                        <Pencil />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="h-4 w-4" /> Add User
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {user ? 'Edit User' : 'Create New User'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        disabled={!!user?.user_id}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ROLE).map((role) => {
                                                if (role === ROLE.ADMIN) return null;
                                                return (
                                                    <SelectItem key={role} value={role}>
                                                        <span className="capitalize">{role}</span>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
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
                                {isSubmitting ? 'Saving...' : (user ? 'Update' : 'Create')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
