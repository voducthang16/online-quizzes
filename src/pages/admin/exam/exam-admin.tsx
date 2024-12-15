import { toast } from 'sonner';
import { useState, useEffect } from "react";
import { ExamApi } from "@/api/page";
import { ExamModel } from "@/models";
import { ExamList } from "./exam-list";
import { ExamForm } from "./exam-form";
import { LoadingSpinner } from "@/components";

const ExamAdmin = () => {
    const [exams, setExams] = useState<ExamModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExams = async () => {
        try {
            const response = await ExamApi.getAllExams({});
            if (response.data) {
                setExams(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch exams', {
                description: error?.message || 'Unable to load exams. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleSubmit = async () => {
        try {
            await fetchExams(); // Refresh list after changes
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process exam operation.'
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const examToDelete = exams.find(exam => exam.exam_id === id);
            
            // TODO: Add delete exam API endpoint
            setExams(currentExams => 
                currentExams.filter(exam => exam.exam_id !== id)
            );

            toast.success('Exam Deleted', {
                description: `${examToDelete?.exam_name || 'Exam'} has been removed.`,
            });
        } catch (error: any) {
            toast.error('Deletion Failed', {
                description: error?.message || 'Unable to delete exam.'
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