import {
  ContactPointResponseSchema,
  ProfilePublicResponseSchema,
  ProfileSettingsResponseSchema,
  UpdateContactPointRequestSchema,
  UpdateProfileSettingsRequestSchema,
} from "@portfolio/contracts";

export const profileApiContracts = {
  publicResponse: ProfilePublicResponseSchema,
  settingsResponse: ProfileSettingsResponseSchema,
  updateSettingsRequest: UpdateProfileSettingsRequestSchema,
  contactPointResponse: ContactPointResponseSchema,
  updateContactPointRequest: UpdateContactPointRequestSchema,
};
