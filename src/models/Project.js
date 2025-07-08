import { projectsService as service } from "@/services";

const Project = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Project;
