import { BankModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { BankForm, BankFormValues } from "./bank-form";
import { DeleteBankDialog } from "./bank-delete";

interface BankListProps {
    banks: BankModel[];
    onSubmit: (data: BankFormValues, existingBank?: BankModel) => void;
    onDelete: (bankId: string) => void;
}

export const BankList = (props: BankListProps) => {
    const { banks, onSubmit, onDelete } = props;

    const columns: ColumnDef<BankModel>[] = [
        {
            accessorKey: "name",
            header: "Bank Name",
        },
        {
            accessorKey: "isPublic",
            header: "Visibility",
            cell: ({ row }) => {
                const isPublic = row.getValue("isPublic");
                return <span>{isPublic ? 'Public' : 'Private'}</span>;
            }
        },
        {
            accessorKey: "createdBy",
            header: "Created By",
            cell: ({ row }) => {
                const createdBy = row.original.createdBy;
                return <span>{createdBy?.fullName || 'N/A'}</span>;
            }
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
                const bank = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <BankForm bank={bank} onSubmit={(data) => onSubmit(data, bank)}/>
                        <DeleteBankDialog bank={bank} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    return (
        <DataTable columns={columns} data={banks} />
    );
};