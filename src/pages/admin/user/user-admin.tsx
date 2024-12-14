import { toast } from 'sonner';
import { useState } from "react";
import { ROLE, USER_LIST } from "@/constants";
import { UserModel } from "@/models";
import { UserList } from "./user-list";
import { UserForm, UserFormValues } from "./user-form";

const UserAdmin = () => {
    const [users, setUsers] = useState<UserModel[]>(USER_LIST as any);

    const handleSubmit = (data: UserFormValues, existingUser?: UserModel) => {
        try {
            if (existingUser) {
                setUsers(currentUsers => 
                    currentUsers.map(user => 
                        user.id === existingUser.id 
                        ? {
                            ...user,
                            ...data,
                            fullName: data.fullName,
                            updatedAt: new Date().toISOString()
                        } : user
                    )
                );

                toast.success('User Updated', {
                    description: `${data.fullName} has been successfully updated.`
                });
            } else {
                const newUser: UserModel = {
                    id: new Date().getTime().toString(),
                    email: data.email,
                    role: data.role,
                    fullName: data.fullName,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                };

                setUsers(currentUsers => [newUser, ...currentUsers]);

                toast.success('User Created', {
                    description: `${data.fullName} has been successfully added.`
                });
            }
        } catch (error) {
            toast.error('Operation Failed', {
                description: 'Unable to process user operation. Please try again.'
            });
        }
    }

    const handleDelete = (id: string) => {
        try {
            const userToDelete = users.find(user => user.id === id);

            setUsers(currentUsers => 
                currentUsers.filter(user => user.id !== id)
            );

            toast.success('User Deleted', {
                description: `${userToDelete?.fullName || 'User'} has been removed.`,
            });
        } catch (error) {
            toast.error('Deletion Failed', {
                description: 'Unable to delete user. Please try again.'
            });
        }
    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Management</h1>
                <UserForm onSubmit={handleSubmit}/>
            </div>
            <UserList users={users} onSubmit={handleSubmit} onDelete={handleDelete}/>
        </>
    )
}

export default UserAdmin;
