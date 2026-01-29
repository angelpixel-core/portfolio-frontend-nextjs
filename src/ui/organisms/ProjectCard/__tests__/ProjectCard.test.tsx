import { render, screen } from "@testing-library/react";
import type { ProjectModel } from "@/domains/project/model/schema";
import { ProjectCard, FeaturedProjectCard, GridProjectCard } from "../index";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock FramerImage
jest.mock("@/atoms/hocs", () => ({
  FramerImage: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

// Mock BoxShadow
jest.mock("@/atoms/shadows", () => ({
  BoxShadow: () => <div data-testid="box-shadow" />,
}));

// Mock icons
jest.mock("@/atoms/icons", () => ({
  GitHubIcon: () => <svg data-testid="github-icon" />,
  ArrowIcon: () => <svg data-testid="arrow-icon" />,
  ReactIcon: () => <svg data-testid="react-icon" />,
  TypeScriptIcon: () => <svg data-testid="typescript-icon" />,
  NextIcon: () => <svg data-testid="next-icon" />,
  NodeIcon: () => <svg data-testid="node-icon" />,
  TailwindIcon: () => <svg data-testid="tailwind-icon" />,
  QuestionIcon: () => <svg data-testid="question-icon" />,
  PostgresIcon: () => <svg data-testid="postgres-icon" />,
  DockerIcon: () => <svg data-testid="docker-icon" />,
  JavaScriptIcon: () => <svg data-testid="javascript-icon" />,
  HTML5Icon: () => <svg data-testid="html5-icon" />,
  CSS3Icon: () => <svg data-testid="css3-icon" />,
  SASSIcon: () => <svg data-testid="sass-icon" />,
  ReduxIcon: () => <svg data-testid="redux-icon" />,
  GraphQLIcon: () => <svg data-testid="graphql-icon" />,
  MongoIcon: () => <svg data-testid="mongo-icon" />,
  RedisIcon: () => <svg data-testid="redis-icon" />,
  GitIcon: () => <svg data-testid="git-icon" />,
  RubyIcon: () => <svg data-testid="ruby-icon" />,
  RailsIcon: () => <svg data-testid="rails-icon" />,
  SvelteIcon: () => <svg data-testid="svelte-icon" />,
  RustIcon: () => <svg data-testid="rust-icon" />,
  KafkaIcon: () => <svg data-testid="kafka-icon" />,
  JenkinsIcon: () => <svg data-testid="jenkins-icon" />,
  TerraformIcon: () => <svg data-testid="terraform-icon" />,
  HerokuIcon: () => <svg data-testid="heroku-icon" />,
}));

// Factory for creating mock projects
function createMockProject(
  overrides: Partial<ProjectModel> = {}
): ProjectModel {
  return {
    id: 1,
    slug: "test-project",
    title: "Test Project",
    summary: "A test project summary",
    description: "A detailed test project description",
    technologies: ["React", "TypeScript", "Next.js"],
    outcomes: "Successful outcomes",
    demo: "https://demo.example.com",
    repository: "https://github.com/example/repo",
    img: "/images/test-project.jpg",
    screenshots: ["/images/screenshot1.jpg"],
    tags: "Web Development",
    featured: false,
    ...overrides,
  };
}

describe("ProjectCard", () => {
  describe("Variant Selection", () => {
    it("renders GridProjectCard when project is not featured", () => {
      const project = createMockProject({ featured: false });
      render(<ProjectCard project={project} />);

      const card = document.querySelector(".project-card--grid");
      expect(card).toBeInTheDocument();
    });

    it("renders FeaturedProjectCard when project is featured", () => {
      const project = createMockProject({ featured: true });
      render(<ProjectCard project={project} />);

      const card = document.querySelector(".project-card--featured");
      expect(card).toBeInTheDocument();
    });
  });

  describe("GridProjectCard", () => {
    it("renders project title", () => {
      const project = createMockProject({ title: "My Awesome Project" });
      render(<GridProjectCard project={project} />);

      expect(screen.getByText("My Awesome Project")).toBeInTheDocument();
    });

    it("renders project tags", () => {
      const project = createMockProject({ tags: "Full Stack" });
      render(<GridProjectCard project={project} />);

      expect(screen.getByText("Full Stack")).toBeInTheDocument();
    });

    it("renders project image with correct alt text", () => {
      const project = createMockProject({
        title: "Image Test",
        img: "/test.jpg",
      });
      render(<GridProjectCard project={project} />);

      const img = screen.getByAltText("Image Test");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/test.jpg");
    });

    it("links to project detail page", () => {
      const project = createMockProject({ slug: "my-project" });
      render(<GridProjectCard project={project} />);

      const links = screen.getAllByRole("link");
      const detailLinks = links.filter(
        (link) => link.getAttribute("href") === "/projects/my-project"
      );
      expect(detailLinks.length).toBeGreaterThan(0);
    });
  });

  describe("FeaturedProjectCard", () => {
    it("renders project summary (not shown in grid variant)", () => {
      const project = createMockProject({
        featured: true,
        summary: "This is a featured summary",
      });
      render(<FeaturedProjectCard project={project} />);

      expect(screen.getByText("This is a featured summary")).toBeInTheDocument();
    });

    it("renders with featured modifier class", () => {
      const project = createMockProject({ featured: true });
      render(<FeaturedProjectCard project={project} />);

      const card = document.querySelector(".project-card--featured");
      expect(card).toBeInTheDocument();
    });
  });
});

describe("TechStackIcons", () => {
  it("renders technology icons based on technologies array (AC1)", () => {
    render(
      <TechStackIcons technologies={["React", "TypeScript", "Next.js"]} />
    );

    expect(screen.getByLabelText("Technologies used")).toBeInTheDocument();
    expect(screen.getByLabelText("React")).toBeInTheDocument();
    expect(screen.getByLabelText("TypeScript")).toBeInTheDocument();
    expect(screen.getByLabelText("Next.js")).toBeInTheDocument();
  });

  it("shows overflow indicator when more than 4 technologies (AC1)", () => {
    const techs = ["React", "TypeScript", "Next.js", "Node.js", "Docker", "PostgreSQL"];
    render(<TechStackIcons technologies={techs} />);

    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(
      screen.getByLabelText("and 2 more technologies")
    ).toBeInTheDocument();
  });

  it("respects custom maxVisible prop", () => {
    const techs = ["React", "TypeScript", "Next.js"];
    render(<TechStackIcons technologies={techs} maxVisible={2} />);

    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("returns null when technologies array is empty (AC3)", () => {
    const { container } = render(<TechStackIcons technologies={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when technologies is undefined (AC3)", () => {
    // @ts-expect-error - Testing undefined case
    const { container } = render(<TechStackIcons technologies={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders QuestionIcon for unknown technologies", () => {
    render(<TechStackIcons technologies={["UnknownTech"]} />);

    expect(screen.getByTestId("question-icon")).toBeInTheDocument();
  });

  it("has accessible role and aria-label", () => {
    render(<TechStackIcons technologies={["React"]} />);

    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-label", "Technologies used");

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("aria-label", "React");
  });
});

describe("ActionLinks", () => {
  it("renders GitHub link when repository is provided (AC2)", () => {
    render(
      <ActionLinks
        repository="https://github.com/example/repo"
        projectTitle="Test Project"
      />
    );

    const link = screen.getByLabelText(
      "View source code for Test Project on GitHub"
    );
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/example/repo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Demo link when demo is provided (AC2)", () => {
    render(
      <ActionLinks demo="https://demo.example.com" projectTitle="Test Project" />
    );

    const link = screen.getByLabelText("View live demo of Test Project");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://demo.example.com");
  });

  it("renders both links when both are provided", () => {
    render(
      <ActionLinks
        repository="https://github.com/example/repo"
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    expect(
      screen.getByLabelText("View source code for Test Project on GitHub")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("View live demo of Test Project")
    ).toBeInTheDocument();
  });

  it("returns null when neither link is provided (AC3)", () => {
    const { container } = render(<ActionLinks projectTitle="Test Project" />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render GitHub link when repository is undefined (AC3)", () => {
    render(
      <ActionLinks demo="https://demo.example.com" projectTitle="Test Project" />
    );

    expect(
      screen.queryByLabelText("View source code for Test Project on GitHub")
    ).not.toBeInTheDocument();
  });

  it("links are keyboard accessible via tab navigation (AC2)", () => {
    render(
      <ActionLinks
        repository="https://github.com/example/repo"
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      // Links should be focusable (no negative tabindex)
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });
  });
});

describe("Edge Cases (AC3)", () => {
  it("handles project without repository gracefully", () => {
    const project = createMockProject({ repository: undefined });
    render(<ProjectCard project={project} />);

    expect(
      screen.queryByLabelText(/View source code.*on GitHub/)
    ).not.toBeInTheDocument();
  });

  it("handles project without demo gracefully", () => {
    const project = createMockProject({ demo: undefined });
    render(<ProjectCard project={project} />);

    expect(screen.queryByLabelText(/View live demo/)).not.toBeInTheDocument();
  });

  it("handles project without technologies gracefully", () => {
    const project = createMockProject({ technologies: [] });
    render(<ProjectCard project={project} />);

    expect(screen.queryByLabelText("Technologies used")).not.toBeInTheDocument();
  });

  it("handles project with no links and no technologies", () => {
    const project = createMockProject({
      technologies: [],
      demo: undefined,
      repository: undefined,
    });

    // Should not throw
    expect(() => render(<ProjectCard project={project} />)).not.toThrow();

    // Title should still render
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });
});

describe("TypeScript Types (AC5)", () => {
  it("accepts ProjectModel type for project prop", () => {
    const project: ProjectModel = createMockProject();

    // TypeScript compilation is the test - if it compiles, types are correct
    expect(() => render(<ProjectCard project={project} />)).not.toThrow();
  });

  it("accepts optional className prop", () => {
    const project = createMockProject();

    expect(() =>
      render(<ProjectCard project={project} className="custom-class" />)
    ).not.toThrow();
  });
});

describe("Snapshot Tests (AC6)", () => {
  it("matches snapshot for grid variant", () => {
    const project = createMockProject({
      featured: false,
      title: "Snapshot Grid Project",
      technologies: ["React", "TypeScript"],
    });

    const { container } = render(<GridProjectCard project={project} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot for featured variant", () => {
    const project = createMockProject({
      featured: true,
      title: "Snapshot Featured Project",
      technologies: ["React", "TypeScript"],
      summary: "A featured project for snapshot testing",
    });

    const { container } = render(<FeaturedProjectCard project={project} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with overflow technologies", () => {
    const { container } = render(
      <TechStackIcons
        technologies={[
          "React",
          "TypeScript",
          "Next.js",
          "Node.js",
          "Docker",
          "PostgreSQL",
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
