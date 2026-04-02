import type {
  TwoFactorEnrollResponse,
  TwoFactorRecoveryCodes,
  TwoFactorStatus,
} from "./schema";

export const twoFactorStatusMock: TwoFactorStatus = {
  enabled: false,
};

export const twoFactorRecoveryCodesMock: TwoFactorRecoveryCodes = [
  "ABCD1-EFGH2",
  "IJKL3-MNOP4",
  "QRST5-UVWX6",
  "YZ12-3456",
  "7890-ABCD",
  "EFGH-IJKL",
  "MNOP-QRST",
  "UVWX-YZ12",
  "3456-7890",
  "CDEF-GHIJ",
];

export const twoFactorEnrollMock: TwoFactorEnrollResponse = {
  otpauthUrl: "otpauth://totp/Angel%20Solutions:demo?secret=ABC123",
  qrCodeDataUrl: "data:image/svg+xml;base64,PHN2Zy8+",
  recoveryCodes: twoFactorRecoveryCodesMock,
};

export default twoFactorStatusMock;
