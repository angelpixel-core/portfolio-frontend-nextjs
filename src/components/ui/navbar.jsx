import CustomLink from "@/components/ui/custom-link";
import Logo from "@/components/ui/logo";

export default function NavBar() {
  return (
    <header className="w-full px-32 py-8 font-medium flex items-center justify-between">
      <nav>
        <CustomLink href="/" title="Home" className="mr-4" />
        <CustomLink href="/about" title="About" className="mx-4" />
        <CustomLink href="/projects" title="Projects" className="mx-4" />
        <CustomLink href="/articles" title="Articles" className="mx-4" />
      </nav>

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>

      <nav>
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
        <CustomLink href="/" title="T" target={"_blank"} />
      </nav>
    </header>
  );
}
