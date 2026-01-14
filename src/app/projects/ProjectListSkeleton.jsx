import React from "react";

const ProjectSkeletonCard = () => (
  <div className="project">
    <div className="project_image-link">
      <div className="project_image h-48 bg-dark/10 dark:bg-light/10 rounded-lg animate-pulse" />
    </div>
    <div className="project_info-grid mt-4">
      <div className="h-4 w-24 bg-dark/10 dark:bg-light/10 rounded mb-2 animate-pulse" />
      <div className="h-6 w-3/4 bg-dark/10 dark:bg-light/10 rounded mb-2 animate-pulse" />
      <div className="h-4 w-1/2 bg-dark/5 dark:bg-light/5 rounded animate-pulse" />
    </div>
  </div>
);

const ProjectListSkeleton = () => {
  return (
    <div className="projects-content">
      <div className="project_container--feat">
        <ProjectSkeletonCard />
      </div>
      <div className="project_container">
        <ProjectSkeletonCard />
      </div>
      <div className="project_container">
        <ProjectSkeletonCard />
      </div>
    </div>
  );
};

export default ProjectListSkeleton;
