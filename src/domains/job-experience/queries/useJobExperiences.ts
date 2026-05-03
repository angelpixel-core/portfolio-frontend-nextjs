import { createFetchAllHook } from "@/lib/createQueryHook";
import type { JobExperiences } from "../model/schema";

const fetchJobExperiences = async (): Promise<JobExperiences> => {
  const response = await fetch("/api/job-experiences", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job experiences");
  }

  return (await response.json()) as JobExperiences;
};

const useJobExperiences = createFetchAllHook<JobExperiences>({
  queryKey: "job-experiences",
  fetchFn: fetchJobExperiences,
});

export default useJobExperiences;
