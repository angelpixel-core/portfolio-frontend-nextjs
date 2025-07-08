import { technologiesService as service } from "@/services";

const Technology = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Technology;
