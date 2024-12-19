import { BankModel, UserModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { BankForm } from "./bank-form";
import { DeleteBankDialog } from "./bank-delete";
import { formatDateByTimezone } from "@/utils";
import { ViewQuestions } from "./view-questions";

interface BankListProps {
    banks: BankModel[];
    onSubmit: () => void;
    onDelete: (bankId: number) => void;
}

export const BankList = (props: BankListProps) => {
    const { banks, onSubmit, onDelete } = props;

    const columns: ColumnDef<BankModel>[] = [
        {
            accessorKey: "bank_name",
            header: "Bank Name",
        },
        {
            accessorKey: "is_public",
            header: "Visibility",
            cell: ({ row }) => {
                const isPublic = row.getValue("is_public");
                return <span>{isPublic ? 'Public' : 'Private'}</span>;
            }
        },
        {
            accessorKey: "createdBy",
            header: "Created By",
            cell: ({ row }) => {
                const createdBy = row.original.created_by as UserModel;
                return <span>{createdBy?.full_name || 'N/A'}</span>;
            }
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                return <span>{formatDateByTimezone(row.getValue("created_at"))}</span>
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const bank = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <ViewQuestions bank={bank} />
                        <BankForm bank={bank} onSubmit={onSubmit}/>
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