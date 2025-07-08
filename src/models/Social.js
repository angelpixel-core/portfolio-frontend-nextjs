import { socialsService as service } from "@/services";

const Social = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Social;
