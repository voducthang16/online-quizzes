import { FC, useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BankApi } from '@/api/page';
import { BankModel, QuestionModel } from '@/models';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components';
import { cn } from '@/lib/utils';

interface ViewQuestionsProps {
    bank: BankModel;
}

export const ViewQuestions: FC<ViewQuestionsProps> = ({ bank }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [questions, setQuestions] = useState<QuestionModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const response = await BankApi.getBankDetail(bank.question_bank_id);
            if (response.data) {
                setQuestions(response.data.data.questions || []);
            }
        } catch (error: any) {
            toast.error('Failed to load questions', {
                description: error?.message || 'Please try again'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Parse the answer options from the JSON string
    const parseAnswerOptions = (answerJson: string) => {
        try {
            const parsedOptions = JSON.parse(answerJson);
            return parsedOptions.map((option: { key: string, value: string }) => option.value);
        } catch (error) {
            console.error('Failed to parse answer options', error);
            return [];
        }
    };

    // Determine the correct answer from the parsed options
    const getCorrectAnswer = (answerJson: string, correctAnswerKey: string) => {
        try {
            const parsedOptions = JSON.parse(answerJson);
            const correctOption = parsedOptions.find((option: { key: string, value: string }) => 
                option.key === correctAnswerKey
            );
            return correctOption ? correctOption.value : '';
        } catch (error) {
            console.error('Failed to find correct answer', error);
            return '';
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) fetchQuestions();
        }}>
            <SheetTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Questions in {bank.bank_name}</SheetTitle>
                </SheetHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                        <div className="pr-4 space-y-4">
                            {questions.length > 0 ? (
                                questions.map((question, index) => {
                                    const answerOptions = parseAnswerOptions(question.answer);
                                    const correctAnswer = getCorrectAnswer(question.answer, question.correct_answer);

                                    return (
                                        <div 
                                            key={question.question_id} 
                                            className="p-4 rounded-lg border bg-card"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium">
                                                    Question {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-sm mb-4">{question.question}</p>
                                            <div className="space-y-2">
                                                {answerOptions.map((answer: string, i: number) => (
                                                    <div 
                                                        key={i}
                                                        className={cn(
                                                            "p-2 rounded text-sm",
                                                            answer === correctAnswer
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100"
                                                        )}
                                                    >
                                                        {answer}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-muted-foreground py-4">
                                    No questions in this bank
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
};