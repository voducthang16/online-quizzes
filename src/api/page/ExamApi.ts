import { ApiRequestModel, ExamModel } from "@/models";
import { BaseService } from "../core";
import { API } from "@/constants";

export const ExamApi = {
    createExam(request: Partial<ApiRequestModel<ExamModel>>) {
        return BaseService.post<ExamModel>({
            url: API.EXAM.CREATE,
            ...request,
        });
    },

    updateExam(request: Partial<ApiRequestModel<ExamModel>>) {
        return BaseService.put<ExamModel>({
            url: API.EXAM.UPDATE.format(request.payload?.exam_id),
            ...request,
        });
    },

    getAllExams(request: Partial<ApiRequestModel<ExamModel>>) {
        return BaseService.get<ExamModel[]>({
            url: API.EXAM.GET_ALL,
            ...request,
        });
    },

    getDetailExam(id: number) {
        return BaseService.get<ExamModel>({
            url: API.EXAM.DETAIL.format(id),
        });
    },

    getExamsByClassId(classId: number) {
        return BaseService.get<ExamModel[]>({
            url: API.EXAM.GET_EXAM_BY_CLASS_ID.format(classId),
        });
    },

    submitExam(request: Partial<ApiRequestModel<ExamModel>>) {
        return BaseService.post<ExamModel>({
            url: API.RESULT.SUBMIT,
            ...request,
        });
    },

    getExamsByUserId(userId: number) {
        return BaseService.get<ExamModel[]>({
            url: API.EXAM.GET_EXAM_BY_USER_ID.format(userId),
        });
    },
};