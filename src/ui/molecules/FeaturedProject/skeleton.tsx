import "./styles.css";

const FeaturedProjectSkeleton = () => {
  return (
    <article className="project--featured" aria-hidden="true">
      {/* Image placeholder */}
      <div className="project_image-link--feat">
        <div
          className="w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
          style={{ aspectRatio: "16/9" }}
        />
      </div>

      {/* Info section */}
      <div className="project_info-grid--feat">
        {/* Tags placeholder */}
        <div className="h-5 w-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Title placeholder */}
        <div className="h-8 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded my-2" />

        {/* Description placeholder */}
        <div className="w-full space-y-2 my-2">
          <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-5/6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4/6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Demo links placeholder */}
        <div className="project_demo-grid--feat">
          <div className="w-10 h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-10 w-28 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ml-4" />
        </div>
      </div>
    </article>
  );
};

export default FeaturedProjectSkeleton;
