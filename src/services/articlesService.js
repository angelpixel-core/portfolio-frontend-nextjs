import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/articles";

const articlesService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default articlesService;
