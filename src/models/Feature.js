import { featuresService as service } from "@/services";

const Feature = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Feature;
