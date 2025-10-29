import { httpRequest } from "@/lib";

const SERVICE_PATH = "site/academics";

const academicsService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default academicsService;
