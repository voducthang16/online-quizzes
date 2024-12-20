import { ClassModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { ClassForm } from "./class-form";
import { DeleteClassDialog } from "./class-delete";
import { ClassAddStudent } from "./class-add-student";
import { formatDateByTimezone } from "@/utils";

interface ClassListProps {
    classes: ClassModel[];
    onSubmit: () => void;
    onDelete: (classId: number) => void;
}

export const ClassList = (props: ClassListProps) => {
    const { classes, onSubmit, onDelete } = props;

    const columns: ColumnDef<ClassModel>[] = [
        {
            accessorKey: "class_name",
            header: "Class Name",
        },
        {
            accessorKey: "subject_name",
            header: "Subject",
        },
        {
            accessorKey: "teacher_name",
            header: "Teacher",
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"))
                return <span>{date.toLocaleDateString()}</span>
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
                const classData = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <ClassAddStudent onSubmit={onSubmit} classData={classData} />
                        <ClassForm class={classData} onSubmit={onSubmit}/>
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