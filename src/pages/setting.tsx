import { FC, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserApi } from '@/api/page';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const settingsFormSchema = z.object({
    full_name: z.string()
        .min(2, "Full name must be at least 2 characters long.")
        .regex(/^[a-zA-Z\s]*$/, {
            message: "Full name can only contain letters and spaces"
        })
        .trim(),
    email: z.string().email("Invalid email address"),
    current_password: z.string().min(6).optional(),
    new_password: z.string().min(6).optional(),
    confirm_password: z.string().min(6).optional(),
}).refine((data) => {
    if (data.current_password || data.new_password || data.confirm_password) {
        return data.new_password === data.confirm_password;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const SettingsPage: FC = () => {
    const { userInfo, setUserInfo } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            full_name: userInfo?.full_name || '',
            email: userInfo?.email || '',
        },
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setIsSubmitting(true);
            const response = await UserApi.updateUser({
                payload: {
                    user_id: userInfo?.user_id,
                    full_name: data.full_name,
                    email: data.email,
                    password: data.new_password,
                    role: userInfo?.role,
                }
            });

            if (response.data) {
                setUserInfo(response.data.data);
                toast.success('Settings Updated', {
                    description: 'Your profile has been updated successfully.'
                });
                form.reset({
                    ...data,
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                });
            }
        } catch (error: any) {
            toast.error('Update Failed', {
                description: error?.message || 'Unable to update settings.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                            Update your account information and password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="border-t pt-6">
                                    <h3 className="font-medium mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="current_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field} 
                                                            type="password"
                                                            placeholder="Enter current password" 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="new_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field} 
                                                            type="password"
                                                            placeholder="Enter new password" 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirm_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field} 
                                                            type="password"
                                                            placeholder="Confirm new password" 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
