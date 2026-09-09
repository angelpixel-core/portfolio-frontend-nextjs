import {
  ContactPointsResponseSchema,
  type ContactPointsResponse,
} from "@portfolio/contracts";

export const fetchContactPoints = async (
  baseUrl: string
): Promise<ContactPointsResponse> => {
  const response = await fetch(`${baseUrl}/profile/contact-points`);
  if (!response.ok) {
    throw new Error(`Contact points request failed with status ${response.status}`);
  }

  return ContactPointsResponseSchema.parse(await response.json());
};
