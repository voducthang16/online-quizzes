import { QuestionModel } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { QuestionForm, QuestionFormValues } from "./question-form";
import { DeleteQuestionDialog } from "./question-delete";

interface QuestionListProps {
    questions: QuestionModel[];
    onSubmit: (data: QuestionFormValues, existingQuestion?: QuestionModel) => void;
    onDelete: (questionId: string) => void;
}

export const QuestionList = (props: QuestionListProps) => {
    const { questions, onSubmit, onDelete } = props;

    const columns: ColumnDef<QuestionModel>[] = [
        {
            accessorKey: "content",
            header: "Question",
            cell: ({ row }) => {
                const content = row.getValue("content") as string;
                return <div className="max-w-[400px] truncate">{content}</div>;
            }
        },
        {
            accessorKey: "bank",
            header: "Bank",
            cell: ({ row }) => {
                const bank = row.original.bank;
                return <span>{bank?.name || 'N/A'}</span>;
            }
        },
        {
            accessorKey: "correctAnswer",
            header: "Correct Answer",
            cell: ({ row }) => {
                const correctAnswer = row.getValue("correctAnswer") as string;
                return <span>{correctAnswer}</span>;
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const question = row.original;
                return (
                    <div className="w-full flex justify-end gap-2">
                        <QuestionForm isHideImport question={question} onSubmit={(data) => onSubmit(data, question)}/>
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