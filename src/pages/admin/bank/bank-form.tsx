import { z } from 'zod';
import { BankModel } from "@/models";
import { useForm } from 'react-hook-form';
import { Pencil, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const bankFormSchema = z.object({
    name: z.string().min(2, "Bank name must be at least 2 characters long."),
    isPublic: z.boolean(),
});

export type BankFormValues = z.infer<typeof bankFormSchema>;

interface BankFormProps {
    bank?: BankModel;
    onSubmit: (data: BankFormValues) => void;
}

export const BankForm: FC<BankFormProps> = ({ bank, onSubmit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<BankFormValues>({
        resolver: zodResolver(bankFormSchema),
        defaultValues: bank ? {
            name: bank.name,
            isPublic: bank.isPublic,
        } : {
            name: '',
            isPublic: false,
        }
    });

    useEffect(() => {
        if (!isDialogOpen) {
            form.reset(bank ? {
                name: bank.name,
                isPublic: bank.isPublic,
            } : {
                name: '',
                isPublic: false,
            });
        }
    }, [isDialogOpen, form, bank]);

    const handleSubmit = (data: BankFormValues) => {
        onSubmit(data);
        setIsDialogOpen(false);
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
                            name="name"
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
                            name="isPublic"
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
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {bank ? 'Update Bank' : 'Create Bank'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};