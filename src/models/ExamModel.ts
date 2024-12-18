import { BaseModel } from "./BaseModel";
import { ClassModel } from "./ClassModel";
import { QuestionModel } from "./QuestionModel";
import { ResultModel } from "./ResultModel";
import { SubjectModel } from "./SubjectModel";
import { UserModel } from "./UserModel";

export interface Answer {
    question_id: number;
    student_answer: string;
}

export interface StudentParticipation {
    student_id: number;
    result: ResultModel;
    student_name: string;
    exam_taken: boolean;
    submitted_at: string;
    total_correct: string;
    total_question: string;
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
    teacher_id?: number;
    status?: number;
    result: ResultModel;
    student_participations: StudentParticipation[];
}