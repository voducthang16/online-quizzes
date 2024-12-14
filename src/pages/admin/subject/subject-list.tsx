import { SubjectModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { SubjectForm, SubjectFormValues } from "./subject-form";
import { DeleteSubjectDialog } from "./subject-delete";

interface SubjectListProps {
    subjects: SubjectModel[];
    onSubmit: (data: SubjectFormValues, existingSubject: SubjectModel) => void;
    onDelete: (subjectId: string) => void;
}


export const SubjectList = (props: SubjectListProps) => {
    const { subjects, onSubmit, onDelete } = props;

    const columns: ColumnDef<SubjectModel>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
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
                const subject = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <SubjectForm subject={subject} onSubmit={(data) => onSubmit(data, subject)}/>
                        <DeleteSubjectDialog subject={subject} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    return (
        <DataTable columns={columns} data={subjects} />
    )
}