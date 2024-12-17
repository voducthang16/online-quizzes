import { QuestionModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { QuestionForm } from "./question-form";
import { DeleteQuestionDialog } from "./question-delete";
import { formatDateByTimezone } from "@/utils";

interface QuestionListProps {
    questions: QuestionModel[];
    onSubmit: () => void;
    onDelete: (questionId: number) => void;
}

export const QuestionList = (props: QuestionListProps) => {
    const { questions, onSubmit, onDelete } = props;

    const columns: ColumnDef<QuestionModel>[] = [
        {
            accessorKey: "question",
            header: "Question",
            cell: ({ row }) => {
                const content = row.getValue("question") as string;
                return <div className="max-w-[300px] truncate">{content}</div>;
            }
        },
        {
            accessorKey: "correct_answer",
            header: "Correct Answer",
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
                const question = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <QuestionForm isHideImport question={question} onSubmit={onSubmit}/>
                        <DeleteQuestionDialog question={question} onDelete={onDelete} />
                    </div>
                )
            },
        },
    ];

    return (
        <DataTable columns={columns} data={questions} />
    );
};