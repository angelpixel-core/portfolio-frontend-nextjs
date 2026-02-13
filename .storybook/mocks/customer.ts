/**
 * Storybook-only fake customer mock data (Lorem Ipsum)
 * Replaces real company data via NormalModuleReplacementPlugin
 *
 * IMPORTANT: Must export both `default` and named `getSliderCustomers`
 * because CustomersSlider imports { getSliderCustomers } from this module.
 */
import type {
  CustomersModel,
  SliderCustomersModel,
} from "@/domains/customer/model/schema";

const defaultSliderCustomers: SliderCustomersModel = [
  { id: 1, name: "Acme Corp", logo: "/images/customers/compass.png" },
  {
    id: 2,
    name: "Lorem Industries",
    logo: "/images/customers/southworks.png",
  },
  { id: 3, name: "Ipsum Technologies", logo: "/images/customers/nubi.png" },
  { id: 4, name: "Dolor Solutions", logo: "/images/customers/bitex.png" },
  { id: 5, name: "Amet Dynamics", logo: "/images/customers/unlp.png" },
];

export const getSliderCustomers = (): SliderCustomersModel => {
  return defaultSliderCustomers;
};

const customersMock: CustomersModel = [
  {
    id: 1,
    name: "Acme Corp",
    company_type: "Technology Services",
    url: "https://example.com/acme",
    logo: "/images/customers/compass.png",
    address: "Lorem City, Placeholder",
    experiences: [
      {
        position: "Lead Frontend Engineer",
        start_date: "Mar 2023",
        end_date: "Dec 2023",
        outcomes: [
          "Lorem ipsum dolor sit amet",
          "Consectetur adipiscing elit",
          "Sed do eiusmod tempor",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Lorem Industries",
    company_type: "Software Development",
    url: "https://example.com/lorem-industries",
    logo: "/images/customers/southworks.png",
    address: "Ipsum Town, Dolor",
    experiences: [
      {
        position: "Senior FullStack Developer",
        start_date: "Feb 2022",
        end_date: "Feb 2023",
        outcomes: [
          "Ut enim ad minim veniam",
          "Quis nostrud exercitation",
          "Ullamco laboris nisi",
        ],
      },
    ],
  },
];

export default customersMock;
