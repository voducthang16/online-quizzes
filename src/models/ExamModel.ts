import { BaseModel } from "./BaseModel";
import { ClassModel } from "./ClassModel";
import { QuestionModel } from "./QuestionModel";
import { SubjectModel } from "./SubjectModel";
import { UserModel } from "./UserModel";

export class ExamModel extends BaseModel {
    exam_id: number;
    exam_name: string;
    subject_id: number;
    subject?: SubjectModel;
    class_id: number;
    classes: ClassModel;
    created_by: UserModel | number;
    duration: number;
    questions: QuestionModel[] | string[];
}