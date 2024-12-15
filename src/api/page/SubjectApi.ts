import { ApiRequestModel, SubjectModel } from "@/models";
import { BaseService } from "../core";
import { API } from "@/constants";

export const SubjectApi = {
    createSubject(request: Partial<ApiRequestModel<SubjectModel>>) {
        return BaseService.post<SubjectModel>({
            url: API.SUBJECT.CREATE,
            ...request,
        });
    },

    getAllSubjects() {
        return BaseService.get<SubjectModel[]>({
            url: API.SUBJECT.GET_ALL,
        });
    },

    getSubjectDetail(id: string) {
        return BaseService.get<SubjectModel>({
            url: API.SUBJECT.GET_DETAIL.format(id),
        });
    },

    updateSubject(request: Partial<ApiRequestModel<SubjectModel>>) {
        return BaseService.put<SubjectModel>({
            url: API.SUBJECT.UPDATE.format(request.payload.subject_id),
            ...request,
        });
    },

    deleteSubject(id: string) {
        return BaseService.delete<void>({
            url: API.SUBJECT.DELETE.format(id),
        });
    }
};