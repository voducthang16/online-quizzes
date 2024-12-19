import { UserModel } from "@/models";
import { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { UserForm } from "./user-form";
import { DeleteUserDialog } from "./user-delete";
import { formatDateByTimezone } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserListProps {
    users: UserModel[];
    onSubmit: () => void;
    onDelete: (userId: number) => void;
}

interface RoleFilterProps {
    table: Table<UserModel>;
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
            filterFn: "equals",
            cell: ({ row }) => {
                return <span className="capitalize">{row.getValue("role")}</span>;
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
                        <UserForm user={user} onSubmit={onSubmit}/>
                        <DeleteUserDialog user={user} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    const RoleFilter = (table: Table<UserModel>) => (
        <Select
            onValueChange={(value) => {
                table.getColumn('role')?.setFilterValue(value === 'all' ? '' : value);
            }}
            defaultValue="all"
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <DataTable
            columns={columns}
            data={users}
            filterComponent={RoleFilter}
            searchPlaceholder="Search by name or email..."
        />
    )
}