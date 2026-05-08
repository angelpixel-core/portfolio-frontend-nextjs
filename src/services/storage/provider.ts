import "server-only";

export type UploadedPublicImage = {
  url: string;
  key: string;
};

export type UploadPublicImageInput = {
  bytes: Uint8Array;
  contentType: string;
  pathname: string;
};

export type StorageProvider = {
  uploadPublicImage: (
    _input: UploadPublicImageInput
  ) => Promise<UploadedPublicImage>;
};
