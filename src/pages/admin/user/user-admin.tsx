import { toast } from 'sonner';
import { UserApi } from "@/api/page";
import { UserModel } from "@/models";
import { UserList } from "./user-list";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components";
import { UserForm } from "./user-form";

const UserAdmin = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await UserApi.getAllUsers();
            if (response.data) {
                setUsers(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch users', {
                description: error?.message || 'Unable to load users. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        try {
            await fetchUsers();
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process user operation. Please try again.'
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const userToDelete = users.find(user => user.id === id);
            
            // TODO: Add delete user API endpoint
            setUsers(currentUsers => 
                currentUsers.filter(user => user.id !== id)
            );

            toast.success('User Deleted', {
                description: `${userToDelete?.full_name || 'User'} has been removed.`,
            });
        } catch (error: any) {
            toast.error('Deletion Failed', {
                description: error?.message || 'Unable to delete user. Please try again.'
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
                <h1 className="text-2xl font-bold">User Management</h1>
                <UserForm onSubmit={handleSubmit}/>
            </div>
            <UserList users={users} onSubmit={handleSubmit} onDelete={handleDelete}/>
        </>
    );
};

export default UserAdmin;