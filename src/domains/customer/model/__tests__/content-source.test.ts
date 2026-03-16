import httpRequest from "@/lib/httpRequest";
import Customer from "../index";

jest.mock("@/lib/httpRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ORIGINAL_ENV = process.env;
const ENV_KEY = "NEXT_PUBLIC_CUSTOMERS";

const ENV_CUSTOMERS = [
  {
    id: 1,
    name: "Env Customer",
    company_type: "Agency",
    url: "https://env.example.com",
    logo: "/images/customers/env.png",
    address: "Env Address",
    experiences: [
      {
        position: "Engineer",
        start_date: "Jan 2024",
        end_date: "Feb 2024",
        outcomes: ["Env outcome"],
      },
    ],
  },
];

const HTTP_CUSTOMERS = [
  {
    id: 2,
    name: "Http Customer",
    company_type: "Studio",
    url: "https://http.example.com",
    logo: "/images/customers/http.png",
    address: "Http Address",
    experiences: [
      {
        position: "Designer",
        start_date: "Mar 2024",
        end_date: "Apr 2024",
        outcomes: ["Http outcome"],
      },
    ],
  },
];

describe("Customer model env-first sourcing", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    (httpRequest as jest.Mock).mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify(ENV_CUSTOMERS);

    const result = await Customer.fetchAll({ useMockFallback: true });

    expect(result).toEqual(ENV_CUSTOMERS);
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("falls back to HTTP when env is absent", async () => {
    (httpRequest as jest.Mock).mockResolvedValue(HTTP_CUSTOMERS);

    const result = await Customer.fetchAll();

    expect(httpRequest).toHaveBeenCalledWith("customers");
    expect(result).toEqual(HTTP_CUSTOMERS);
  });

  it("throws on invalid env content without HTTP fallback", async () => {
    process.env[ENV_KEY] = JSON.stringify([
      {
        id: "bad-id",
        name: "Broken",
        company_type: "Agency",
        url: "https://broken.example.com",
        logo: "/images/customers/bad.png",
        address: "Broken",
        experiences: [],
      },
    ]);

    await expect(Customer.fetchAll()).rejects.toThrow();
    expect(httpRequest).not.toHaveBeenCalled();
  });
});
