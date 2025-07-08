import { fetchClient } from "@/lib/apiClient";

const SERVICE_PATH = "site/features";

const fetchAll = async () => await fetchClient(SERVICE_PATH);

const fetchBy = async ({ id }) => {
  const records = await fetchClient(`${SERVICE_PATH}/${id}`);
  return Array.isArray(records) ? records[0] : null;
};

const featuresService = {
  fetchAll,
  fetchBy,
};

export default featuresService;
