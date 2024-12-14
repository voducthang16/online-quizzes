import { BaseModel } from "./BaseModel";
import { SubjectModel } from "./SubjectModel";
import { UserModel } from "./UserModel";

export class ClassModel extends BaseModel {
    name: string;
    subjectId: string;
    teacherId: string;
    students: string[];
    subject: SubjectModel;
    teacher: UserModel;
};
