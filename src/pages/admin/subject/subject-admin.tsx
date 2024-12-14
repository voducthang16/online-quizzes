import { toast } from 'sonner';
import { useState } from "react";
import { SUBJECT_LIST } from "@/constants";
import { SubjectModel } from "@/models";
import { SubjectList } from "./subject-list";
import { SubjectForm, SubjectFormValues } from "./subject-form";

const SubjectAdmin = () => {
    const [subjects, setSubjects] = useState<SubjectModel[]>(SUBJECT_LIST as any);

    const handleSubmit = (data: SubjectFormValues, existingSubject?: SubjectModel) => {
        try {
            if (existingSubject) {
                setSubjects(currentSubjects => 
                    currentSubjects.map(subject => 
                        subject.id === existingSubject.id 
                        ? {
                            ...subject,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : subject
                    )
                );

                toast.success('Subject Updated', {
                    description: `${data.name} has been successfully updated.`
                });
            } else {
                const newSubject: SubjectModel = {
                    id: new Date().getTime().toString(),
                    name: data.name,
                    description: data.description,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isDeleted: false,
                };

                setSubjects(currentSubjects => [newSubject, ...currentSubjects]);

                toast.success('Subject Created', {
                    description: `${data.name} has been successfully added.`
                });
            }
        } catch (error) {
            toast.error('Operation Failed', {
                description: 'Unable to process subject operation. Please try again.'
            });
        }
    }

    const handleDelete = (id: string) => {
        try {
            const subjectToDelete = subjects.find(subject => subject.id === id);

            setSubjects(currentSubjects => 
                currentSubjects.filter(subject => subject.id !== id)
            );

            toast.success('Subject Deleted', {
                description: `${subjectToDelete?.name || 'Subject'} has been removed.`,
            });
        } catch (error) {
            toast.error('Deletion Failed', {
                description: 'Unable to delete subject. Please try again.'
            });
        }
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
