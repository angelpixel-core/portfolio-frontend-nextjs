import type { Meta, StoryObj } from "@storybook/react";

import Experiences from "../index";
import { Skeleton } from "../skeleton";
import model from "@/domains/job-experience/model";
import type { JobExperience } from "@/domains/job-experience";

const createExperience = (
  id: number,
  company: string,
  group: JobExperience["group"]
): JobExperience => ({
  id,
  position: "Software Engineer",
  company,
  companyLink: `https://${company.toLowerCase()}.example.com`,
  time: "Jan 2024 - Present",
  year: "2024",
  address: "Remote",
  contextBadges: ["Product", "Remote"],
  technologies: ["TypeScript", "React"],
  group,
  work: [{ description: "Delivered customer-facing features" }],
});

const bothGroupsExperiences: JobExperience[] = [
  createExperience(1, "Atlas", "engineering"),
  createExperience(2, "Beacon", "platform"),
  createExperience(3, "Comet", "engineering"),
];

const onlyEngineeringExperiences: JobExperience[] = [
  createExperience(4, "Delta", "engineering"),
  createExperience(5, "Echo", "engineering"),
];

const invalidGroupExperiences = [
  createExperience(6, "Foxtrot", "engineering"),
  {
    ...createExperience(7, "Ghost", "platform"),
    group: "invalid-group",
  } as unknown as JobExperience,
  createExperience(8, "Halo", "platform"),
];

const withMockedExperiences = (experiences: JobExperience[]) => {
  const MockedExperiencesStory = () => {
    model.fetchAll = async () => experiences;
    return <Experiences />;
  };

  MockedExperiencesStory.displayName = "MockedExperiencesStory";

  return MockedExperiencesStory;
};

const meta = {
  title: "Organisms/Experiences",
  component: Experiences,
  tags: ["autodocs"],
} satisfies Meta<typeof Experiences>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BothGroupsPresent: Story = {
  render: withMockedExperiences(bothGroupsExperiences),
};

export const OnlyEngineeringPresent: Story = {
  render: withMockedExperiences(onlyEngineeringExperiences),
};

export const InvalidGroupEntriesOmitted: Story = {
  render: withMockedExperiences(invalidGroupExperiences),
};

export const Loading: Story = {
  render: () => <Skeleton />,
};
