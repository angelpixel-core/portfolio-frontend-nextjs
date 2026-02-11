export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-4xl font-bold text-light">404</h2>
      <p className="max-w-md text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
      >
        Go home
      </a>
    </div>
  );
}
