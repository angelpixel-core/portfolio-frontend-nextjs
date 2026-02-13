/**
 * Storybook-only fake content mock data (Lorem Ipsum)
 * Replaces real page content data via NormalModuleReplacementPlugin
 */
import type { ContentsModel } from "@/domains/content/model/schema";

const contentsMock: ContentsModel = [
  {
    id: 1,
    title: "Lorem Ipsum Developer",
    slug: "landing",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    mainContent:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 2,
    title: "De Finibus Bonorum",
    slug: "about",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    mainContent:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  },
];

export default contentsMock;
