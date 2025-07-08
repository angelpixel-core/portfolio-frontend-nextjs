import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/job-experiences";

const jobExperiencesService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default jobExperiencesService;
