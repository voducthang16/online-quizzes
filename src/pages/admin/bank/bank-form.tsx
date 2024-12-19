import { z } from 'zod';
import { BankModel } from "@/models";
import { useForm } from 'react-hook-form';
import { FC, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BankApi } from '@/api/page';
import { toast } from 'sonner';
import { useUserStore } from '@/stores';

const bankFormSchema = z.object({
    bank_name: z.string()
        .min(2, "Bank name must be at least 2 characters long.")
        .regex(/^[a-zA-Z\s]*$/, {
            message: "Bank name can only contain letters and spaces"
        })
        .trim(),
    is_public: z.boolean()
});

export type BankFormValues = z.infer<typeof bankFormSchema>;

interface BankFormProps {
    bank?: BankModel;
    onSubmit: () => void;
}

export const BankForm: FC<BankFormProps> = ({ bank, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userInfo } = useUserStore();

    const form = useForm<BankFormValues>({
        resolver: zodResolver(bankFormSchema),
        defaultValues: bank ? {
            bank_name: bank.bank_name,
            is_public: bank.is_public,
        } : {
            bank_name: '',
            is_public: false,
        }
    });

    const handleSubmit = async (data: BankFormValues) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const submitAction = bank
                ? BankApi.updateBank({ payload: { question_bank_id: bank.question_bank_id, ...data } })
                : BankApi.createBank({ payload: { ...data, created_by: userInfo.user_id } });

            const response = await submitAction;

            if (!response.data.code) {
                toast.success(bank ? 'Bank Updated' : 'Bank Created', {
                    description: `${data.bank_name} has been ${bank ? 'updated' : 'created'} successfully.`
                });

                onSubmit();
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process bank operation.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {bank ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-gray-200 flex items-center w-8 h-8"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Add Bank
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {bank ? 'Edit Bank' : 'Create New Bank'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bank_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter bank name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_public"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visibility</FormLabel>
                                    <Select 
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                        defaultValue={field.value ? 'true' : 'false'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Public</SelectItem>
                                            <SelectItem value="false">Private</SelectItem>
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
                                {isSubmitting ? 'Saving...' : (bank ? 'Update Bank' : 'Create Bank')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};