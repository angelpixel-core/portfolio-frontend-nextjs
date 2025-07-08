import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/projects";

const projectsService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default projectsService;
