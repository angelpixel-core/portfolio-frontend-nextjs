import { notFound } from "next/navigation";
import type { Metadata } from "next";
import model from "@/domains/project/model";
import { ProjectDetail } from "@/organisms";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await model.fetchBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found | Projects",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.img],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [project.img],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await model.fetchBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
