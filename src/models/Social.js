// TODO: continuar con la integracion con la API
import { fetchData } from "@/lib/apiService";

const all = async () => {
  return await fetchData("navigation/social-links");
};

const Social = {
  all,
};

export default Social;
