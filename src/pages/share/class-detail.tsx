import { toast } from 'sonner';
import { ROLE } from '@/constants';
import { useUserStore } from '@/stores';
import { ConfirmDialog, LoadingSpinner } from '@/components';
import { formatDateByTimezone } from '@/utils';
import { ClassApi, ExamApi } from '@/api/page';
import { Button } from '@/components/ui/button';
import { FC, useEffect, useState } from 'react';
import { ClassModel, ExamModel } from '@/models';
import { useNavigate, useParams } from 'react-router';
import { Users, Clock, GraduationCap, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClassDetailPage: FC = () => {
    const { id } = useParams();
    const { userInfo } = useUserStore();
    const [classDetail, setClassDetail] = useState<ClassModel | null>(null);
    const [exams, setExams] = useState<ExamModel[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState({
        class: true,
        exams: false
    });

    const navigate = useNavigate();

    const fetchClassDetail = async () => {
        if (!id) return;

        try {
            setIsLoading(prev => ({ ...prev, class: true }));
            const response = await ClassApi.getDetail(+id);
            if (response.data) {
                setClassDetail(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load class details', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, class: false }));
        }
    };

    const fetchExams = async () => {
        if (!id) return;

        try {
            setIsLoading(prev => ({ ...prev, exams: true }));
            const response = await ExamApi.getExamsByClassId(+id);
            if (response.data) {
                setExams(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load exams', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, exams: false }));
        }
    };

    useEffect(() => {
        if (id) {
            fetchClassDetail();
            fetchExams();
        }
    }, [id]);

    return (
        <div className="container mx-auto">
            {isLoading.class ? (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            ) : classDetail ? (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{classDetail.class_name}</CardTitle>
                            <CardDescription>
                                {classDetail.subject?.subject_name || 'No subject assigned'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-6 w-6 text-blue-500" />
                                    <span>{classDetail.students.length || 0} Students</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-6 w-6 text-green-500" />
                                    <span>Teacher: {classDetail.teacher?.full_name || 'Unassigned'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-orange-500" />
                                    <span>Created: {formatDateByTimezone(classDetail.created_at)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="exams" className="mt-8">
                        <TabsList>
                            {userInfo?.role !== ROLE.STUDENT && (
                                <TabsTrigger value="students">Students</TabsTrigger>
                            )}
                            <TabsTrigger value="exams">Exams</TabsTrigger>
                        </TabsList>

                        {userInfo?.role !== ROLE.STUDENT && (
                            <TabsContent value="students" className="mt-4">
                                <div className="rounded-md border">
                                    {classDetail.students?.length ? (
                                        <div className="divide-y">
                                            {classDetail.students.map((student) => (
                                                <div
                                                    key={student.student_id}
                                                    className="p-4 flex items-center justify-between hover:bg-gray-50"
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
                                                        onClick={() => setIsOpen(true)}
                                                    >
                                                        Remove
                                                    </Button>
                                                    <ConfirmDialog
                                                        open={isOpen}
                                                        onOpenChange={setIsOpen}
                                                        title="Remove Student"
                                                        description={`Are you sure you want to remove ${student.full_name} from this class?`}
                                                        onConfirm={async () => {
                                                            try {
                                                                await ClassApi.removeStudentFromClass(
                                                                    classDetail.class_id,
                                                                    student.student_id
                                                                );
                                                                toast.success('Student Removed', {
                                                                    description: `${student.full_name} has been removed from the class.`
                                                                });
                                                                fetchClassDetail();
                                                            } catch (error: any) {
                                                                toast.error('Failed to remove student', {
                                                                    description: error?.message || 'Please try again'
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No students enrolled in this class
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        )}

                        <TabsContent value="exams" className="mt-4">
                            {isLoading.exams ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : exams.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {exams.map((exam) => (
                                        <Card key={exam.exam_id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <CardTitle className="flex items-center justify-between">
                                                    <span>{exam.exam_name}</span>
                                                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                        {exam.duration} mins
                                                    </span>
                                                </CardTitle>
                                                <CardDescription>
                                                    {classDetail.subject?.subject_name}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span>{exam.questions?.length || 0} Questions</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>Created: {formatDateByTimezone(exam.created_at)}</span>
                                                    </div>
                                                    {userInfo?.role === ROLE.STUDENT && (
                                                        <Button
                                                            className="w-full"
                                                            onClick={() => navigate(`/exam/take/${exam.exam_id}`)}
                                                        >
                                                            Take Exam
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-md border text-center py-8 text-muted-foreground">
                                    No exams available for this class
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    Class details not found
                </div>
            )}
        </div>
    );
};

export default ClassDetailPage;