import { createFetchAllHook } from "@/lib/createQueryHook";
import { ContactPointsSchema, type ContactPointsModel } from "../model/schema";

const fetchContactPoints = async (): Promise<ContactPointsModel> => {
  const response = await fetch("/api/contact-points", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact points");
  }

  return ContactPointsSchema.parse(await response.json());
};

const useContactPoints = createFetchAllHook<ContactPointsModel>({
  queryKey: "contact-points",
  fetchFn: fetchContactPoints,
});

export default useContactPoints;
