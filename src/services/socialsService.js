import { fetchClient } from "@/lib/apiClient";

const SERVICE_PATH = "site/social_networks";

const fetchAll = async () => await fetchClient(SERVICE_PATH);

const fetchBy = async ({ id }) => {
  const records = await fetchClient(`${SERVICE_PATH}/${id}`);
  return Array.isArray(records) ? records[0] : null;
};

const socialsService = {
  fetchAll,
  fetchBy,
};

export default socialsService;
