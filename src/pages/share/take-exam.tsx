import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ExamApi } from '@/api/page';
import { Answer, ExamModel, QuestionModel } from '@/models';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LoadingSpinner } from '@/components';
import { Timer } from 'lucide-react';
import { useUserStore } from '@/stores';

const TakeExamPage: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState<ExamModel | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isLoading, setIsLoading] = useState({
        exam: true,
        submit: false
    });
    const { userInfo } = useUserStore();

    const fetchExam = async () => {
        if (!id) return;

        try {
            setIsLoading(prev => ({ ...prev, exam: true }));
            const response = await ExamApi.getDetailExam(+id);
            if (response.data) {
                setExam(response.data.data);
                setTimeLeft(response.data.data.duration * 60);
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
    }, [id]);

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

            const formattedAnswers: Answer[] = Object.entries(answers).map(([questionId, answer]) => ({
                question_id: parseInt(questionId),
                student_answer: answer
            }));

            const response = await ExamApi.submitExam({
                payload: {
                    exam_id: +id,
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
        }
    };

    if (isLoading.exam) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!exam) return null;

    const currentQuestion = exam.questions[currentQuestionIndex] as QuestionModel;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{exam.exam_name}</h1>
                    <p className="text-muted-foreground mt-2">
                        Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <Timer className="h-6 w-6" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={answers[currentQuestion.question_id]?.toString()}
                        onValueChange={(value) => {
                            setAnswers(prev => ({
                                ...prev,
                                [currentQuestion.question_id]: value
                            }));
                        }}
                    >
                        {JSON.parse(currentQuestion.answer).map((answer: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={answer} id={`answer-${index}`} />
                                <label htmlFor={`answer-${index}`}>{answer}</label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            <div className="mt-8 flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>
                {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button onClick={handleSubmit}>Submit Exam</Button>
                ) : (
                    <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TakeExamPage;