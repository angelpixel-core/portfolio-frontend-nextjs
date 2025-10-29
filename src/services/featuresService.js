import { httpRequest } from "@/lib";

const SERVICE_PATH = "site/features";

const featuresService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default featuresService;
