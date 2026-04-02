import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../page";

const mockUseSession = jest.fn();
const mockOpenAuthPanel = jest.fn();
const mockSetThemeMode = jest.fn();

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mockUseSession(),
  },
}));

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => ({
    openAuthPanel: mockOpenAuthPanel,
  }),
}));

jest.mock("@/state/slices/themeMode/hooks", () => ({
  __esModule: true,
  default: () => ({
    mode: "light",
    setThemeMode: mockSetThemeMode,
  }),
}));

jest.mock("@/organisms/TwoFactorSettings", () => ({
  __esModule: true,
  default: () => <div data-testid="two-factor-settings">TwoFactor</div>,
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { email: "angel@test.com", name: "Angel" } },
      isPending: false,
    });
    global.URL.createObjectURL = jest.fn(() => "blob:preview");
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("switches between tabs", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("settings-general")).toBeInTheDocument();
    expect(screen.queryByTestId("settings-security")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Security" }));

    expect(screen.getByTestId("settings-security")).toBeInTheDocument();
    expect(screen.queryByTestId("settings-general")).not.toBeInTheDocument();
    expect(screen.getByTestId("two-factor-settings")).toBeInTheDocument();
  });

  it("updates display name and profile photo selection", async () => {
    const { container } = render(<SettingsPage />);

    const nameInput = await screen.findByLabelText(/display name/i);
    expect(nameInput).toHaveValue("angel");
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(nameInput).toHaveValue("New Name");

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("Selected: avatar.png")).toBeInTheDocument();
    expect(screen.getByAltText("Selected profile")).toHaveAttribute(
      "src",
      "blob:preview"
    );
  });
});
