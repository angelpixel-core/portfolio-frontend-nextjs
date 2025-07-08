import { httpRequest } from "@/lib/httpRequest";

const SERVICE_PATH = "site/social-networks";

const socialNetworksService = {
  fetchAll: () => httpRequest(`${SERVICE_PATH}`),
  fetchBy: ({ id }) => httpRequest(`${SERVICE_PATH}/${id}`),
};

export default socialNetworksService;
