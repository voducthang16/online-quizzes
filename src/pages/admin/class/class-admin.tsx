import { toast } from 'sonner';
import { useState, useEffect } from "react";
import { ClassApi } from "@/api/page";
import { ClassModel } from "@/models";
import { ClassList } from "./class-list";
import { LoadingSpinner } from "@/components";
import { ClassForm } from "./class-form";

const ClassAdmin = () => {
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const response = await ClassApi.getAllClasses();
            if (response.data) {
                setClasses(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch classes', {
                description: error?.message || 'Unable to load classes. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleSubmit = async () => {
        try {
            await fetchClasses(); // Refresh list after changes
        } catch (error: any) {
            toast.error('Operation Failed', {
                description: error?.message || 'Unable to process class operation.'
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const classToDelete = classes.find(cls => cls.class_id === id);
            
            await ClassApi.deleteClass(id);
            
            setClasses(currentClasses => 
                currentClasses.filter(cls => cls.class_id !== id)
            );

            toast.success('Class Deleted', {
                description: `${classToDelete?.class_name || 'Class'} has been removed.`,
            });
        } catch (error: any) {
            toast.error('Deletion Failed', {
                description: error?.message || 'Unable to delete class.'
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
                <h1 className="text-2xl font-bold">Class Management</h1>
                <ClassForm onSubmit={handleSubmit}/>
            </div>
            <ClassList 
                classes={classes} 
                onSubmit={handleSubmit} 
                onDelete={handleDelete}
            />
        </>
    );
};

export default ClassAdmin;