import { toast } from 'sonner';
import { useState, useEffect, FC } from "react";
import { BankApi } from "@/api/page";
import { BankModel } from "@/models";
import { BankList } from "./bank-list";
import { LoadingSpinner } from "@/components";
import { BankForm } from "./bank-form";
import { useUserStore } from '@/stores';

interface BankAdminProps {
    isTeacherView?: boolean;
}

const BankAdmin: FC<BankAdminProps> = ({ isTeacherView = false }) => {
    const [banks, setBanks] = useState<BankModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useUserStore();

    const fetchBanks = async () => {
        try {
            const response = isTeacherView 
                ? await BankApi.getBanksByUser(userInfo?.user_id)
                : await BankApi.getAllBanks();
            if (response.data) {
                setBanks(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch banks', {
                description: error?.message || 'Unable to load banks. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const handleSubmit = async () => {
        try {
            await fetchBanks();
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process bank operation. Please try again.'
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const bankToDelete = banks.find(bank => bank.question_bank_id === id);
            
            await BankApi.deleteBank(id);
            setBanks(currentBanks => 
                currentBanks.filter(bank => bank.question_bank_id !== id)
            );

            toast.success('Bank Deleted', {
                description: `${bankToDelete?.bank_name || 'Bank'} has been removed.`,
            });
        } catch (error: any) {
            toast.error('Deletion Failed', {
                description: error?.message || 'Unable to delete bank. Please try again.'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Bank Management</h1>
                <BankForm onSubmit={handleSubmit}/>
            </div>
            <BankList banks={banks} onSubmit={handleSubmit} onDelete={handleDelete} />
        </>
    );
};

export default BankAdmin;