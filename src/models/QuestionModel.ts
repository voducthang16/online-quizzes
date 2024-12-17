import { BankModel } from "./BankModel";
import { BaseModel } from "./BaseModel";

export class QuestionModel extends BaseModel {
    question_id: number;
    question_bank_id: number;
    question: string;
    answer: string;
    correct_answer: string;
    bank_id?: number;
    bank?: BankModel;
    student_answer?: string;
}