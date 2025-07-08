import { contentsService as service } from "@/services";

const Content = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Content;
