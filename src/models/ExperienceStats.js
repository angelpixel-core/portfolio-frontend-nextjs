import { experienceStatsService as service } from "@/services";

const ExperienceStats = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default ExperienceStats;
