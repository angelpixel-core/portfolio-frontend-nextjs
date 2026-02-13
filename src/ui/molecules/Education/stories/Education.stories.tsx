import type { Meta, StoryObj } from "@storybook/react";

import Education from "../index";
import { EducationSkeleton } from "../skeleton";

const sampleEducation = {
  id: 1,
  degree: "Bachelor of Computer Science",
  institution: "Universidad Tecnológica Nacional",
  start_date: "2016",
  end_date: "2021",
  resume: "Graduated with honors. Focus on distributed systems and software engineering.",
};

const meta = {
  title: "Molecules/Education",
  component: Education,
  tags: ["autodocs"],
  args: {
    id: sampleEducation.id,
    degree: sampleEducation.degree,
    institution: sampleEducation.institution,
    start_date: sampleEducation.start_date,
    end_date: sampleEducation.end_date,
    resume: sampleEducation.resume,
  },
} satisfies Meta<typeof Education>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVerification: Story = {
  args: {
    verification_url: "https://example.com/verify/12345",
  },
};

export const Loading: Story = {
  render: () => <EducationSkeleton />,
};
