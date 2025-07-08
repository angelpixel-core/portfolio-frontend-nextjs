import { experienceStatsService as service } from "@/services";

const ExperienceStats = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default ExperienceStats;
