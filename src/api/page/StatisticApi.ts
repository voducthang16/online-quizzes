import { StatisticModel } from "@/models";
import { BaseService } from "../core";
import { API } from "@/constants";

export const StatisticApi = {
    getStatistic() {
        return BaseService.get<StatisticModel>({
            url: API.STATISTIC.GET_STATISTIC,
        });
    }
};
