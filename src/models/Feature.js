// TODO: continuar con la integracion con la API
import { fetchData } from "@/lib/apiService";

const all = async () => {
  return await fetchData("navigation/nav-links");
};

const Feature = {
  all,
};

export default Feature;
