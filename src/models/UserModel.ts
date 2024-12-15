import { ROLE } from "@/constants";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
    user_id: string;
    email: string;
    password?: string;
    full_name: string;
    role: ROLE;
};
