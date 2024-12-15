import { toast } from 'sonner';
import { SubjectApi } from "@/api/page";
import { SubjectModel } from "@/models";
import { SubjectList } from "./subject-list";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components";
import { SubjectForm } from "./subject-form";

const SubjectAdmin = () => {
    const [subjects, setSubjects] = useState<SubjectModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubjects = async () => {
        try {
            const response = await SubjectApi.getAllSubjects();
            if (response.data) {
                setSubjects(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch subjects', {
                description: error?.message || 'Unable to load subjects. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSubmit = async () => {
        try {
            await fetchSubjects();
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process subject operation.'
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const subjectToDelete = subjects.find(subject => subject.subject_id === id);

            await SubjectApi.deleteSubject(id);

            setSubjects(currentSubjects => 
                currentSubjects.filter(subject => subject.subject_id !== id)
            );

            toast.success('Subject Deleted', {
                description: `${subjectToDelete?.subject_name || 'Subject'} has been removed.`,
            });
        } catch (error: any) {
            toast.error('Deletion Failed', {
                description: error?.message || 'Unable to delete subject.'
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
                <h1 className="text-2xl font-bold">Subject Management</h1>
                <SubjectForm onSubmit={handleSubmit}/>
            </div>
            <SubjectList subjects={subjects} onSubmit={handleSubmit} onDelete={handleDelete}/>
        </>
    )
}

export default SubjectAdmin;