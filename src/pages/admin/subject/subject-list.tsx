import { SubjectModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { SubjectForm, SubjectFormValues } from "./subject-form";
import { DeleteSubjectDialog } from "./subject-delete";
import { formatDateByTimezone } from "@/utils";

interface SubjectListProps {
    subjects: SubjectModel[];
    onSubmit: (data: SubjectFormValues, existingSubject: SubjectModel) => void;
    onDelete: (subjectId: string) => void;
}


export const SubjectList = (props: SubjectListProps) => {
    const { subjects, onSubmit, onDelete } = props;

    const columns: ColumnDef<SubjectModel>[] = [
        {
            accessorKey: "subject_name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
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