import {
  ProfileSettingsResponseSchema,
  UpdateProfileSettingsRequestSchema,
  type ProfileSettingsResponse,
  type UpdateProfileSettingsRequest,
} from "@portfolio/contracts";

export const updateProfileSettings = async (
  baseUrl: string,
  input: UpdateProfileSettingsRequest
): Promise<ProfileSettingsResponse> => {
  const payload = UpdateProfileSettingsRequestSchema.parse(input);
  const response = await fetch(`${baseUrl}/profile/settings`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Profile settings request failed with status ${response.status}`);
  }

  return ProfileSettingsResponseSchema.parse(await response.json());
};
