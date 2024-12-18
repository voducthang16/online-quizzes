import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ExamApi } from '@/api/page';
import { ExamModel } from '@/models';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components';
import { Clock, Users, CheckCircle2, XCircle } from 'lucide-react';
import { formatDateByTimezone, formatScore } from '@/utils';

const TeacherExamDetail: FC = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const [exam, setExam] = useState<ExamModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExamDetail = async () => {
        if (!examId) return;

        try {
            setIsLoading(true);
            const response = await ExamApi.getDetailExam(+examId, {
                payload: {
                    teacher_id: userInfo?.user_id
                }
            });
            if (response.data) {
                setExam(response.data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load exam details', {
                description: error?.message || 'Please try again'
            });
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExamDetail();
    }, [examId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!exam) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{exam.exam_name}</h1>
                        <p className="text-muted-foreground mt-2">
                            {exam.classes?.class_name} - {exam.subject?.subject_name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span>{exam.duration} minute{exam.duration > 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Total Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{exam.student_participations.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {exam.student_participations.filter(s => s.exam_taken).length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {exam.student_participations.filter(s => !s.exam_taken).length}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                                <div>Student Name</div>
                                <div>Status</div>
                                <div>Score</div>
                                <div>Submitted At</div>
                            </div>
                            <div className="divide-y">
                                {exam.student_participations.map((student) => (
                                    <div 
                                        key={student.student_id} 
                                        className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-50"
                                    >
                                        <div className="font-medium">
                                            {student.student_name}
                                        </div>
                                        <div>
                                            {student.exam_taken ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            {student.exam_taken ? (
                                                <span className="font-medium">
                                                    {formatScore((+student.total_correct / +student.total_question) * 10)}/10
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {student.submitted_at ? formatDateByTimezone(student.submitted_at) : "-"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TeacherExamDetail;