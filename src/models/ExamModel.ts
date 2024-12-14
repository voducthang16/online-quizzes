import { BaseModel } from "./BaseModel";
import { ClassModel } from "./ClassModel";
import { QuestionModel } from "./QuestionModel";
import { SubjectModel } from "./SubjectModel";
import { UserModel } from "./UserModel";

export class ExamModel extends BaseModel {
    name: string;
    subjectId: string;
    subject?: SubjectModel;
    classId: string;
    class: ClassModel;
    createdBy: UserModel;
    duration: number;
    questions: QuestionModel[];
}