import { BaseModel } from "./BaseModel";
import { ClassModel } from "./ClassModel";
import { QuestionModel } from "./QuestionModel";
import { SubjectModel } from "./SubjectModel";
import { UserModel } from "./UserModel";

export interface Answer {
    question_id: number;
    student_answer: string;
}

export class ExamModel extends BaseModel {
    exam_id: number;
    exam_name: string;
    subject_id: number;
    subject?: SubjectModel;
    class_id: number;
    classes: ClassModel;
    created_by: UserModel | number;
    duration: number;
    questions: Partial<QuestionModel>[] | string[];
    answers?: Answer[];
    student_id?: number;
}