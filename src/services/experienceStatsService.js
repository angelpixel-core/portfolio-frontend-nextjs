import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/experience-stats";

const experienceStatsService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default experienceStatsService;
