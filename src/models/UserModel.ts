import { ROLE } from "@/constants";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
    email: string;
    fullName: string;
    role: ROLE;
};
