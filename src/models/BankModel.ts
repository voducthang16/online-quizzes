import { BaseModel } from "./BaseModel";
import { UserModel } from "./UserModel";

export class BankModel extends BaseModel {
    name: string;
    isPublic: boolean;
    createdBy?: UserModel;
}