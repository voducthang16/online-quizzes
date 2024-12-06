import { toast } from 'sonner';
import { useState } from "react";
import { ClassModel } from "@/models";
import { ClassList } from "./class-list";
import { ClassForm, ClassFormValues } from "./class-form";

const generateFakeClasses = (count: number): ClassModel[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `CLASS${i + 1}`,
        name: `Class ${i + 1}`,
        subjectId: `SUBJECT${i + 1}`,
        teacherId: `TEACHER${i + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
    }));
};

const ClassAdmin = () => {
    const [classes, setClasses] = useState<ClassModel[]>(generateFakeClasses(5));

    const handleSubmit = (data: ClassFormValues, existingClass?: ClassModel) => {
        try {
            if (existingClass) {
                setClasses(currentClasses => 
                    currentClasses.map(classItem => 
                        classItem.id === existingClass.id 
                        ? {
                            ...classItem,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : classItem
                    )
                );

                toast.success('Class Updated', {
                    description: `${data.name} has been successfully updated.`
                });
            } else {
                const newClass: ClassModel = {
                    id: new Date().getTime().toString(),
                    name: data.name,
                    subjectId: data.subjectId,
                    teacherId: data.teacherId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                };

                setClasses(currentClasses => [newClass, ...currentClasses]);

                toast.success('Class Created', {
                    description: `${data.name} has been successfully added.`
                });
            }
        } catch (error) {
            toast.error('Operation Failed', {
                description: 'Unable to process class operation. Please try again.'
            });
        }
    };

    const handleDelete = (id: string) => {
        try {
            const classToDelete = classes.find(classItem => classItem.id === id);

            setClasses(currentClasses => 
                currentClasses.filter(classItem => classItem.id !== id)
            );

            toast.success('Class Deleted', {
                description: `${classToDelete?.name || 'Class'} has been removed.`,
            });
        } catch (error) {
            toast.error('Deletion Failed', {
                description: 'Unable to delete class. Please try again.'
            });
        }
    };

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