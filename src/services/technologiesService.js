import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/technologies";

const technologiesService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default technologiesService;
