import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="project-not-found">
      <h1>Project Not Found</h1>
      <p>The project you are looking for does not exist or has been removed.</p>
      <Link href="/projects" className="project-not-found__link">
        Back to Projects
      </Link>
    </div>
  );
}
