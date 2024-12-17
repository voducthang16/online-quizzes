import { toast } from 'sonner';
import { useState, useEffect, FC } from "react";
import { QuestionListApi } from "@/api/page";
import { QuestionModel } from "@/models";
import { QuestionList } from "./question-list";
import { LoadingSpinner } from "@/components";
import { QuestionForm } from "./question-form";
import { useUserStore } from '@/stores';

interface QuestionAdminProps {
    isTeacherView?: boolean;
}

const QuestionAdmin: FC<QuestionAdminProps> = ({ isTeacherView = false }) => {
    const [questions, setQuestions] = useState<QuestionModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useUserStore();

    const fetchQuestions = async () => {
        try {
            const response = isTeacherView 
                ? await QuestionListApi.getQuestionByUser(userInfo?.user_id)
                : await QuestionListApi.getAllQuestions();
            if (response.data) {
                setQuestions(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch questions', {
                description: error?.message || 'Unable to load questions. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleSubmit = async () => {
        try {
            await fetchQuestions();
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process question operation.'
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const questionToDelete = questions.find(question => question.question_bank_id === id);

            await QuestionListApi.deleteQuestion(id);

            setQuestions(currentQuestions => 
                currentQuestions.filter(question => question.question_bank_id !== id)
            );

            toast.success('Question Deleted', {
                description: `${questionToDelete?.question || 'Question'} has been removed.`,
            });
        } catch (error: any) {
            toast.error('Deletion Failed', {
                description: error?.message || 'Unable to delete question.'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Question Management</h1>
                <QuestionForm onSubmit={handleSubmit}/>
            </div>
            <QuestionList
                questions={questions} 
                onSubmit={handleSubmit} 
                onDelete={handleDelete}
            />
        </>
    );
};

export default QuestionAdmin;