import { UserModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { UserForm, UserFormValues } from "./user-form";
import { DeleteUserDialog } from "./user-delete";
import { formatDateByTimezone } from "@/utils";

interface UserListProps {
    users: UserModel[];
    onSubmit: (data: UserFormValues, existingUser: UserModel) => void;
    onDelete: (userId: string) => void;
}


export const UserList = (props: UserListProps) => {
    const { users, onSubmit, onDelete } = props;

    const columns: ColumnDef<UserModel>[] = [
        {
            accessorKey: "full_name",
            header: "Full Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                return <span className="capitalize">{row.getValue("role")}</span>
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                return <span>{formatDateByTimezone(row.getValue("created_at"))}</span>
            },
        },
        {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ row }) => {
                return <span>{formatDateByTimezone(row.getValue("updated_at"))}</span>
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