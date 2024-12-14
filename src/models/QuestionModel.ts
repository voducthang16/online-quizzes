import { BankModel } from "./BankModel";
import { BaseModel } from "./BaseModel";

export class QuestionModel extends BaseModel {
    content: string;
    answer: string[];
    correctAnswer: string;
    bankId?: string;
    bank?: BankModel;
}