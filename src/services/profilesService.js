import { fetchClient } from "@/lib/apiClient";

const SERVICE_PATH = "profiles";

const fetchAll = async () => await fetchClient(SERVICE_PATH);

const fetchBy = async ({ id }) => {
  const records = await fetchClient(`${SERVICE_PATH}?id=${id}`);
  return Array.isArray(records) ? records[0] : null;
};

const profilesService = {
  fetchAll,
  fetchBy,
};

export default profilesService;
