import { toast } from 'sonner';
import { ClassApi } from '@/api/page';
import { ClassModel } from '@/models';
import { useUserStore } from '@/stores';
import { useNavigate } from 'react-router';
import { LoadingSpinner } from '@/components';
import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeacherClassList: FC = () => {
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { userInfo } = useUserStore();

    const fetchClasses = async () => {
        try {
            const response = await ClassApi.getClassesByTeacher(userInfo?.user_id);
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
    }, [userInfo]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">My Classes</h1>
            </div>

            {classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    You are not assigned to any classes yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <Card 
                            key={classItem.class_id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <CardTitle>{classItem.class_name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{classItem.students?.length || 0} Students</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span>Subject: {classItem?.subject_name}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full"
                                        onClick={() => navigate(`/class/${classItem.class_id}`)}
                                    >
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherClassList;