import { FC, useEffect, useState } from 'react';
import { UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { UserApi, ClassApi } from '@/api/page';
import { Button } from "@/components/ui/button";
import { ClassModel, UserModel } from "@/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface StudentData {
    student_id: number;
    full_name: string;
    email: string;
}

interface ClassAddStudentProps {
    classData: ClassModel;
    onSubmit: () => void;
}

export const ClassAddStudent: FC<ClassAddStudentProps> = ({ classData, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState({
        allStudents: false,
        classStudents: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [allStudents, setAllStudents] = useState<StudentData[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<StudentData[]>([]);

    const fetchClassStudents = async () => {
        try {
            setIsLoading(prev => ({ ...prev, classStudents: true }));
            const response = await ClassApi.getStudentsInClass(classData.class_id);
            if (response.data) {
                setSelectedStudents(response.data.data as StudentData[]);
            }
        } catch (error: any) {
            toast.error('Failed to load class students', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, classStudents: false }));
        }
    };

    const fetchAllStudents = async () => {
        try {
            setIsLoading(prev => ({ ...prev, allStudents: true }));
            const response = await UserApi.getAllStudents();
            if (response.data) {
                const mappedStudents = response.data.data.map((student: UserModel) => ({
                    student_id: student.user_id,
                    full_name: student.full_name,
                    email: student.email
                }));
                setAllStudents(mappedStudents);
            }
        } catch (error: any) {
            toast.error('Failed to load students', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, allStudents: false }));
        }
    };

    useEffect(() => {
        if (isOpen) {
            Promise.all([fetchAllStudents(), fetchClassStudents()]);
        }
    }, [isOpen]);

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);

            const payload = {
                class_name: classData.class_name,
                subject_id: classData.subject_id,
                teacher_id: classData.teacher_id,
                students: selectedStudents.map(student => ({
                    student_id: student.student_id
                }))
            };

            await ClassApi.updateClass({
                payload: {
                    class_id: classData.class_id,
                    ...payload
                }
            });

            toast.success('Students Updated', {
                description: 'Class students have been updated successfully.'
            });

            onSubmit();
            setIsOpen(false);
        } catch (error: any) {
            toast.error('Failed to update students', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddStudent = (student: StudentData) => {
        // Prevent adding duplicate students
        if (!selectedStudents.some(s => s.student_id === student.student_id)) {
            setSelectedStudents(current => [...current, {
                student_id: student.student_id,
                full_name: student.full_name,
                email: student.email
            }]);
        }
    };

    const handleRemoveStudent = (studentId: number) => {
        setSelectedStudents(current => 
            current.filter(s => s.student_id !== studentId)
        );
    };

    const isLoadingAny = Object.values(isLoading).some(Boolean);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8"
                >
                    <UserCog className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Manage Students</SheetTitle>
                    <SheetDescription>
                        Add or remove students for {classData.class_name}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    {isLoadingAny ? (
                        <div className="flex items-center justify-center py-6">
                            Loading students...
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium mb-2">
                                    Current Students ({selectedStudents.length})
                                </h3>
                                <ScrollArea className="h-[200px] rounded-md border p-4">
                                    {selectedStudents.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedStudents.map((student) => (
                                                <div 
                                                    key={`selected-${student.student_id}`}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-medium">{student.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {student.email}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleRemoveStudent(student.student_id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-4">
                                            No students in this class yet
                                        </p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium mb-2">
                                    Available Students ({allStudents.length - selectedStudents.length})
                                </h3>
                                <ScrollArea className="h-[200px] rounded-md border p-4">
                                    <div className="space-y-2">
                                        {allStudents
                                            .filter(student => 
                                                !selectedStudents.some(s => s.student_id === student.student_id)
                                            )
                                            .map((student) => (
                                                <div 
                                                    key={`available-${student.student_id}`}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-medium">{student.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {student.email}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleAddStudent(student)}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsOpen(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};