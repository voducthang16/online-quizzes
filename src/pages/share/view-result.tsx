import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ExamApi } from "@/api/page";
import { ExamModel } from "@/models";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components";
import { Check, X, Clock, GraduationCap } from "lucide-react";
import { useUserStore } from "@/stores";
import { formatDateByTimezone, formatScore } from "@/utils";

const ViewResultPage: FC = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState<ExamModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useUserStore();

    const fetchExamResult = async () => {
        if (!examId) return;

        try {
            setIsLoading(true);
            const response = await ExamApi.getDetailExam(+examId, {
                payload: {
                    student_id: userInfo?.user_id,
                },
            });
            if (response.data) {
                setExam(response.data.data);
            }
        } catch (error: any) {
            toast.error("Failed to load exam result", {
                description: error?.message || "Please try again",
            });
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExamResult();
    }, [examId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!exam) return null;

    const parseAnswers = (answerString: string) => {
        try {
            return JSON.parse(answerString);
        } catch {
            return [];
        }
    };

    const scorePercentage = (+exam.result.total_correct / +exam.result.total_question) * 100;
    const scoreOutOfTen = (scorePercentage / 100) * 10;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-[1fr_400px] gap-6">
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold mb-4">{exam.exam_name}</h1>

                    {exam.questions.map((question) => {
                        const answers = parseAnswers(question.answer);
                        const isCorrect = question.student_answer === question.correct_answer;

                        return (
                            <Card key={question.question_id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <p className="text-xl">{question.question}</p>
                                        {isCorrect ? (
                                            <Check className="text-green-500 h-6 w-6" />
                                        ) : (
                                            <X className="text-red-500 h-6 w-6" />
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {answers.map((answer: any) => (
                                            <div
                                                key={answer.key}
                                                className={`p-3 rounded-lg ${
                                                    answer.key === question.correct_answer
                                                        ? "bg-green-100 text-green-700"
                                                        : answer.key === question.student_answer
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{answer.value}</span>
                                                    {answer.key === question.student_answer && (
                                                        <span className="text-sm">Your answer</span>
                                                    )}
                                                    {answer.key === question.correct_answer && (
                                                        <span className="text-sm">Correct answer</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="space-y-4 md:sticky md:top-8 md:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Exam Result</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Score</span>
                                    <span className="font-bold text-xl">{formatScore(scoreOutOfTen)}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${
                                            scorePercentage >= 70
                                                ? "bg-green-600"
                                                : scorePercentage >= 40
                                                ? "bg-yellow-600"
                                                : "bg-red-600"
                                        }`}
                                        style={{ width: `${scorePercentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        <GraduationCap className="inline-block mr-2 h-4 w-4" />
                                        Correct Answers
                                    </span>
                                    <span>
                                        {exam.result.total_correct} / {exam.result.total_question}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        <Clock className="inline-block mr-2 h-4 w-4" />
                                        Submitted
                                    </span>
                                    <span>{formatDateByTimezone(exam.result.submitted_at)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ViewResultPage;
