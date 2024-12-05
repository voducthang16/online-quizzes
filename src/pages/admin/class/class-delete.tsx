import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ClassModel } from "@/models";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface DeleteClassDialogProps {
    class: ClassModel;
    onDelete: (classId: string) => void;
    disabled?: boolean;
}

export const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({ 
    class: classData, 
    onDelete, 
    disabled = false 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete(classData.id);
        setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={disabled}
                    className="flex items-center w-8 h-8"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                        Delete Class Confirmation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the class:
                        <div className="my-2 p-2 bg-muted rounded">
                            <div><strong>Name:</strong> {classData.name}</div>
                            <div><strong>Subject ID:</strong> {classData.subjectId}</div>
                            <div><strong>Teacher ID:</strong> {classData.teacherId}</div>
                        </div>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete Class
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};