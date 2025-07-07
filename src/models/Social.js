import { socialsService as service } from "@/services";

const Social = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Social;
