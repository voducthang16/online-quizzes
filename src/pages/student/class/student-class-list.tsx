import { FC, useEffect, useState } from 'react';
import { ClassApi } from '@/api/page';
import { ClassModel } from '@/models';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { formatDateByTimezone } from '@/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

interface StudentClassListProps {
    studentId: number;
}

export const StudentClassList: FC<StudentClassListProps> = ({ studentId }) => {
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const fetchClasses = async () => {
        try {
            const response = await ClassApi.getClassesStudentEnroll(studentId);
            if (response.data) {
                setClasses(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch classes', {
                description: error?.message || 'Unable to load your classes'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [studentId]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <h2 className="mb-8 text-2xl font-bold">My Classes</h2>
            {classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    You are not enrolled in any classes yet.
                </div>
            ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                        {classes.map((classItem) => (
                            <Card key={classItem.class_id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>{classItem.class_name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Teacher: {classItem.teacher?.full_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span>Subject Name: {classItem.subject?.subject_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>Created: {formatDateByTimezone(classItem.created_at)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4">
                                    <Button
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => navigate(`/class/${classItem.class_id}`)}
                                    >
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};