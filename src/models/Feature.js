import { featuresService as service } from "@/services";

const Feature = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Feature;
