import { ClassModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { ClassForm, ClassFormValues } from "./class-form";
import { DeleteClassDialog } from "./class-delete";

interface ClassListProps {
    classes: ClassModel[];
    onSubmit: (data: ClassFormValues, existingClass?: ClassModel) => void;
    onDelete: (classId: string) => void;
}

export const ClassList = (props: ClassListProps) => {
    const { classes, onSubmit, onDelete } = props;

    const columns: ColumnDef<ClassModel>[] = [
        {
            accessorKey: "name",
            header: "Class Name",
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }) => {
                const subject = row.original.subject;
                return <span>{subject?.name || 'N/A'}</span>;
            }
        },
        {
            accessorKey: "teacher",
            header: "Teacher",
            cell: ({ row }) => {
                const teacher = row.original.teacher;
                return <span>{teacher?.fullName || 'N/A'}</span>;
            }
        },
        {
            accessorKey: "students",
            header: "Students",
            cell: ({ row }) => {
                const students = row.original.students;
                return <span>{students?.length || 0} students</span>;
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
                const classData = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <ClassForm class={classData} onSubmit={(data) => onSubmit(data, classData)}/>
                        <DeleteClassDialog class={classData} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    return (
        <DataTable columns={columns} data={classes} />
    );
};