export default function MainContainer({ children, className }) {
  return (
    <div
      className={`
        inline-block 
        w-full
        h-full
        bg-light dark:bg-dark
        p-32 xl:p-24 lg:p-16 md:p-12 sm:p-8
        z-0
        ${className}
     `}
    >
      {children}
    </div>
  );
}
