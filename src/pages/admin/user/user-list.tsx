import { UserModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { UserForm, UserFormValues } from "./user-form";
import { DeleteUserDialog } from "./user-delete";

interface UserListProps {
    users: UserModel[];
    onSubmit: (data: UserFormValues, existingUser: UserModel) => void;
    onDelete: (userId: string) => void;
}


export const UserList = (props: UserListProps) => {
    const { users, onSubmit, onDelete } = props;

    const columns: ColumnDef<UserModel>[] = [
        {
            accessorKey: "fullName",
            header: "Full Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"))
                return <span>{date.toLocaleDateString()}</span>
            },
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({ row }) => {
                const date = new Date(row.getValue("updatedAt"))
                return <span>{date.toLocaleDateString()}</span>
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <UserForm user={user} onSubmit={(data) => onSubmit(data, user)}/>
                        <DeleteUserDialog user={user} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    return (
        <DataTable columns={columns} data={users} />
    )
}