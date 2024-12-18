import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ExamApi } from '@/api/page';
import { ExamModel, QuestionModel } from '@/models';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LoadingSpinner } from '@/components';
import { Timer, Check, AlertCircle } from 'lucide-react';
import { useUserStore } from '@/stores';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
} from '@/components/ui/alert-dialog';

const TakeExamPage: FC = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState<ExamModel | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isLoading, setIsLoading] = useState({
        exam: true,
        submit: false
    });
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const { userInfo } = useUserStore();

    const fetchExam = async () => {
        if (!examId) return;

        try {
            setIsLoading(prev => ({ ...prev, exam: true }));
            const response = await ExamApi.getDetailExam(+examId, {
                payload: {
                    student_id: userInfo?.user_id,
                }
            });
            if (response.data) {
                setExam(response.data.data);
                setTimeLeft(response.data?.data?.duration * 60);
            }
        } catch (error: any) {
            toast.error('Failed to load exam', {
                description: error?.message || 'Please try again'
            });
            navigate(-1);
        } finally {
            setIsLoading(prev => ({ ...prev, exam: false }));
        }
    };

    useEffect(() => {
        fetchExam();
    }, [examId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && exam) {
            handleSubmit();
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(prev => ({ ...prev, submit: true }));

            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                question_id: parseInt(questionId),
                student_answer: answer
            }));

            const response = await ExamApi.submitExam({
                payload: {
                    exam_id: +examId,
                    student_id: userInfo?.user_id,
                    answers: formattedAnswers
                }
            });

            if (response.data) {
                toast.success('Exam submitted successfully');
                navigate(-1);
            }
        } catch (error: any) {
            toast.error('Failed to submit exam', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, submit: false }));
            setIsSubmitDialogOpen(false);
        }
    };

    const validateSubmit = () => {
        const incompleteQuestions = exam?.questions.filter((q): q is QuestionModel => 
            typeof q !== 'string' && !answers[q.question_id]
        ) || [];

        if (incompleteQuestions.length > 0) {
            toast.warning('Incomplete Exam', {
                description: `You have ${incompleteQuestions.length} unanswered questions.`,
                icon: <AlertCircle className="text-yellow-500" />
            });
            return;
        }

        setIsSubmitDialogOpen(true);
    };

    if (isLoading.exam) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!exam) return null;

    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
        setCompletedQuestions(prev => {
            const updated = new Set(prev);
            updated.add(questionId);
            return updated;
        });
    };

    const parseAnswerOptions = (answerString: string) => {
        try {
            const parsed = JSON.parse(answerString);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
                {/* Left Column - Exam Questions */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold mb-4">{exam.exam_name}</h1>

                    {exam.questions.map((question) => {
                        const answerOptions = parseAnswerOptions(question.answer);
                        return (
                            <Card key={question.question_id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <p className="text-xl">{question.question}</p>
                                        {completedQuestions.has(question.question_id) && (
                                            <Check className="text-green-500" />
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={answers[question.question_id]?.toString()}
                                        onValueChange={(value) => handleAnswerChange(question.question_id, value)}
                                    >
                                        {answerOptions.map((answer: any, index: number) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <RadioGroupItem 
                                                    value={answer.key} 
                                                    id={`answer-${question.question_id}-${index}`} 
                                                />
                                                <label htmlFor={`answer-${question.question_id}-${index}`}>
                                                    {answer.value}
                                                </label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Right Column - Progress and Submit */}
                <div className="space-y-4 md:sticky md:top-8 md:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Exam Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-xl font-semibold">
                                <Timer className="h-6 w-6" />
                                <span>Time Left: {formatTime(timeLeft)}</span>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {exam.questions.map((question, index) => (
                                    <div 
                                        key={question.question_id} 
                                        className={`h-8 w-8 flex items-center justify-center rounded ${
                                            completedQuestions.has(question.question_id) 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span>Completed Questions:</span>
                                <span>{completedQuestions.size} / {exam.questions.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{
                                        width: `${(completedQuestions.size / exam.questions.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>

                    <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                        <Button 
                            onClick={validateSubmit}
                            disabled={isLoading.submit}
                            className="w-full"
                        >
                            {isLoading.submit ? 'Submitting...' : 'Submit Exam'}
                        </Button>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Exam Submission</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to submit the exam? 
                                    {timeLeft > 0 && ` You still have ${formatTime(timeLeft)} remaining.`}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmit}>
                                    Confirm Submit
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default TakeExamPage;