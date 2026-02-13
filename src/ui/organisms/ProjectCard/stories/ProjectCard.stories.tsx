import type { Meta, StoryObj } from "@storybook/react";

import ProjectCard from "../index";
import { FeaturedProjectCard } from "../variants/Featured";
import { GridProjectCard } from "../variants/Grid";
import projectsMock from "@/domains/project/model/mock";

const featuredProject = projectsMock.find((p) => p.featured)!;
const gridProject = projectsMock.find((p) => !p.featured)!;

const meta = {
  title: "Organisms/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Featured: Story = {
  render: () => <FeaturedProjectCard project={featuredProject} />,
};

export const Grid: Story = {
  render: () => <GridProjectCard project={gridProject} />,
};

export const Auto: Story = {
  args: {
    project: featuredProject,
  },
};
