import { ApiRequestModel, ClassModel, UserModel } from "@/models";
import { BaseService } from "../core";
import { API } from "@/constants";

export const ClassApi = {
    createClass(request: Partial<ApiRequestModel<ClassModel>>) {
        return BaseService.post<ClassModel>({
            url: API.CLASS.CREATE,
            ...request,
        });
    },

    getAllClasses() {
        return BaseService.get<ClassModel[]>({
            url: API.CLASS.GET_ALL,
        });
    },

    updateClass(request: Partial<ApiRequestModel<ClassModel>>) {
        return BaseService.put<ClassModel>({
            url: API.CLASS.UPDATE.format(request.payload.class_id),
            ...request,
        });
    },

    deleteClass(id: number) {
        return BaseService.delete<void>({
            url: API.CLASS.DELETE.format(id),
        });
    },

    getClassStudents(classId: string) {
        return BaseService.get<UserModel[]>({
            url: API.CLASS.GET_STUDENTS.format(classId),
        });
    },

    getClassTeachers(classId: string) {
        return BaseService.get<UserModel[]>({
            url: API.CLASS.GET_TEACHERS.format(classId),
        });
    },

    getClassesByTeacher(teacherId: string) {
        return BaseService.get<ClassModel[]>({
            url: API.CLASS.GET_CLASS_BY_TEACHER.format(teacherId),
        });
    }
};