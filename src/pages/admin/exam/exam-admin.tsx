import { toast } from 'sonner';
import { useState } from "react";
import { EXAM_LIST } from "@/constants";
import { ExamModel } from "@/models";
import { ExamList } from "./exam-list";
import { ExamForm, ExamFormValues } from "./exam-form";

const ExamAdmin = () => {
    const [exams, setExams] = useState<ExamModel[]>(EXAM_LIST as any);

    const handleSubmit = (data: ExamFormValues, existingExam?: ExamModel) => {
        try {
            if (existingExam) {
                // setExams(currentExams => 
                //     currentExams.map(exam => 
                //         exam.id === existingExam.id 
                //         ? {
                //             ...exam,
                //             ...data,
                //             updated_at: new Date().toISOString()
                //         } : exam
                //     )
                // );

                toast.success('Exam Updated', {
                    description: `${data.name} has been successfully updated.`
                });
            } else {
                const newExam: ExamModel = {
                    id: `EXAM${Date.now()}`,
                    ...data,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    isDeleted: false,
                } as any;

                setExams(currentExams => [newExam, ...currentExams]);

                toast.success('Exam Created', {
                    description: `${data.name} has been successfully added.`
                });
            }
        } catch (error) {
            toast.error('Operation Failed', {
                description: 'Unable to process exam operation. Please try again.'
            });
        }
    };

    const handleDelete = (id: string) => {
        try {
            const examToDelete = exams.find(exam => exam.id === id);

            setExams(currentExams => 
                currentExams.filter(exam => exam.id !== id)
            );

            toast.success('Exam Deleted', {
                description: `${examToDelete?.name || 'Exam'} has been removed.`,
            });
        } catch (error) {
            toast.error('Deletion Failed', {
                description: 'Unable to delete exam. Please try again.'
            });
        }
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Exam Management</h1>
                    <ExamForm onSubmit={handleSubmit}/>
            </div>
            <ExamList 
                exams={exams} 
                onSubmit={handleSubmit} 
                onDelete={handleDelete}
            />
        </>
    );
};

export default ExamAdmin;