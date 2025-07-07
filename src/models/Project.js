import { projectsService as service } from "@/services";

const Project = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Project;
