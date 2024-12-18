import { BaseModel } from "./BaseModel";
import { QuestionModel } from "./QuestionModel";
import { UserModel } from "./UserModel";

export class BankModel extends BaseModel {
    question_bank_id: number
    bank_name: string;
    is_public: boolean;
    created_by?: UserModel | number;
    questions: QuestionModel[];
    teacher_id: number;
}