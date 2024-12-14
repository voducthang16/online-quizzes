import { toast } from 'sonner';
import { useState } from "react";
import { BankModel } from '@/models';
import { BankList } from './bank-list';
import { BankForm, BankFormValues } from './bank-form';

const generateFakeBanks = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `BANK${i + 1}`,
        name: `Bank ${i + 1}`,
        isPublic: i % 2 === 0,
        createdBy: {
            id: `USER${i + 1}`,
            email: `teacher${i + 1}@example.com`,
            fullName: `Teacher ${i + 1}`,
            role: 'Teacher',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
    }));
};

const BankAdmin = () => {
    const [banks, setBanks] = useState<BankModel[]>(generateFakeBanks(5) as any);

    const handleSubmit = (data: BankFormValues, existingBank?: BankModel) => {
        try {
            if (existingBank) {
                setBanks(currentBanks => 
                    currentBanks.map(bank => 
                        bank.id === existingBank.id 
                        ? {
                            ...bank,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : bank
                    )
                );

                toast.success('Bank Updated', {
                    description: `${data.name} has been successfully updated.`
                });
            } else {
                const newBank: BankModel = {
                    id: new Date().getTime().toString(),
                    name: data.name,
                    isPublic: data.isPublic,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                };

                setBanks(currentBanks => [newBank, ...currentBanks]);

                toast.success('Bank Created', {
                    description: `${data.name} has been successfully added.`
                });
            }
        } catch (error) {
            toast.error('Operation Failed', {
                description: 'Unable to process bank operation. Please try again.'
            });
        }
    };

    const handleDelete = (id: string) => {
        try {
            const bankToDelete = banks.find(bank => bank.id === id);

            setBanks(currentBanks => 
                currentBanks.filter(bank => bank.id !== id)
            );

            toast.success('Bank Deleted', {
                description: `${bankToDelete?.name || 'Bank'} has been removed.`,
            });
        } catch (error) {
            toast.error('Deletion Failed', {
                description: 'Unable to delete bank. Please try again.'
            });
        }
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Bank Management</h1>
                <BankForm onSubmit={handleSubmit}/>
            </div>
            <BankList
                banks={banks} 
                onSubmit={handleSubmit} 
                onDelete={handleDelete}
            />
        </>
    );
};

export default BankAdmin;