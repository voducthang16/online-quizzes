import { BaseModel } from "./BaseModel";
import { SubjectModel } from "./SubjectModel";
import { UserModel } from "./UserModel";

export class ClassModel extends BaseModel {
    class_id: number;
    class_name: string;
    subject_id: number;
    teacher_id: number;
    students: Partial<UserModel>[];
    subject: SubjectModel;
    teacher: UserModel;
};
