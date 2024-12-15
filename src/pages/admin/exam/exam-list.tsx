import { ExamModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { ExamForm, ExamFormValues } from "./exam-form";
import { DeleteExamDialog } from "./exam-delete";

interface ExamListProps {
    exams: ExamModel[];
    onSubmit: () => void;
    onDelete: (examId: number) => void;
}

export const ExamList = (props: ExamListProps) => {
    const { exams, onSubmit, onDelete } = props;

    const columns: ColumnDef<ExamModel>[] = [
        {
            accessorKey: "exam_name",
            header: "Exam Name",
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }) => {
                const subject = row.original.subject;
                return <span>{subject?.subject_name || 'N/A'}</span>;
            }
        },
        {
            accessorKey: "class",
            header: "Class",
            cell: ({ row }) => {
                const cls = row.original.classes;
                return <span>{cls?.class_name || 'N/A'}</span>;
            }
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({ row }) => {
                return <span>{row.getValue("duration")} minutes</span>;
            }
        },
        {
            accessorKey: "questions",
            header: "Questions",
            cell: ({ row }) => {
                const questions = row.original.questions;
                return <span>{questions?.length || 0} questions</span>;
            }
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const exam = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <ExamForm exam={exam} onSubmit={onSubmit}/>
                        <DeleteExamDialog exam={exam} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    return (
        <DataTable columns={columns} data={exams} />
    );
};