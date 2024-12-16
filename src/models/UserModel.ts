import { ROLE } from "@/constants";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
    user_id: number;
    student_id?: number;
    teacher_ud?: number;
    email: string;
    password?: string;
    full_name: string;
    role: ROLE;
};
