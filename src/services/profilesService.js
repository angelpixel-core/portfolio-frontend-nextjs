import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/profiles";

const profilesService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default profilesService;
