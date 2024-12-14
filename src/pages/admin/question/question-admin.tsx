import { toast } from 'sonner';
import { useState } from "react";
import { QUESTION_LIST } from "@/constants";
import { QuestionModel } from "@/models";
import { QuestionList } from "./question-list";
import { QuestionForm, QuestionFormValues } from "./question-form";

const QuestionAdmin = () => {
    const [questions, setQuestions] = useState<QuestionModel[]>(QUESTION_LIST as any);

    const handleSubmit = (data: QuestionFormValues, existingQuestion?: QuestionModel) => {
        try {
            if (existingQuestion) {
                setQuestions(currentQuestions => 
                    currentQuestions.map(question => 
                        question.id === existingQuestion.id 
                        ? {
                            ...question,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : question
                    )
                );

                toast.success('Question Updated', {
                    description: 'Question has been successfully updated.'
                });
            } else {
                const newQuestion: QuestionModel = {
                    id: `QUES${Date.now()}`,
                    ...data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                } as any;

                setQuestions(currentQuestions => [newQuestion, ...currentQuestions]);

                toast.success('Question Created', {
                    description: 'New question has been successfully added.'
                });
            }
        } catch (error) {
            toast.error('Operation Failed', {
                description: 'Unable to process question operation. Please try again.'
            });
        }
    };

    const handleDelete = (id: string) => {
        try {
            const questionToDelete = questions.find(question => question.id === id);

            setQuestions(currentQuestions => 
                currentQuestions.filter(question => question.id !== id)
            );

            toast.success('Question Deleted', {
                description: 'Question has been successfully removed.',
            });
        } catch (error) {
            toast.error('Deletion Failed', {
                description: 'Unable to delete question. Please try again.'
            });
        }
    };

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