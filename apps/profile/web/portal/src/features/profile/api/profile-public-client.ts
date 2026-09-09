import {
  ProfilePublicResponseSchema,
  type ProfilePublicResponse,
} from "@portfolio/contracts";

export const fetchPublicProfile = async (
  baseUrl: string
): Promise<ProfilePublicResponse> => {
  const response = await fetch(`${baseUrl}/profile/public`);
  if (!response.ok) {
    throw new Error(`Profile request failed with status ${response.status}`);
  }

  return ProfilePublicResponseSchema.parse(await response.json());
};
