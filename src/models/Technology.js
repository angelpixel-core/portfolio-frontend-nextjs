import { technologiesService as service } from "@/services";

const Technology = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Technology;
