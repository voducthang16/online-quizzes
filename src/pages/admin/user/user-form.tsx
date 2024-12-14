import { z } from 'zod';
import { ROLE } from "@/constants";
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
    fullName: z.string().min(2, "Full name must be at least 2 characters long."),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
    user?: UserModel;
    onSubmit: (data: UserFormValues) => void;
}

export const UserForm: FC<UserFormProps> = ({ user, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: user ? {
            email: user.email,
            role: user.role,
            fullName: user.fullName || '',
        } : {
            email: '',
            role: ROLE.STUDENT,
            fullName: '',
        }
    });

    useEffect(() => {
        if (!isDialogOpen) {
            form.reset(user ? {
                email: user.email,
                role: user.role,
                fullName: user.fullName || '',
            } : {
                email: '',
                role: ROLE.STUDENT,
                fullName: '',
            });
        }
    }, [isDialogOpen, form, user]);

    const handleSubmit = (data: UserFormValues) => {
        onSubmit(data);
        onClose();
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
                                        disabled={!!user?.id}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ROLE).map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
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
                            name="fullName"
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
                            <Button type="submit">
                                {user ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
