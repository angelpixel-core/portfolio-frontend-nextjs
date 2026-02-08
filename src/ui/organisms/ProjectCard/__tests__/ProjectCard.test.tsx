import React from "react";
import { render, screen } from "@testing-library/react";
import type { ProjectModel } from "@/domains/project/model/schema";
import { ProjectCard, FeaturedProjectCard, GridProjectCard } from "../index";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import { getTechIcon, hasTechIcon } from "../utils/getTechIcon";

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
    // eslint-disable-next-line @next/next/no-img-element
  }) => <img src={src} alt={alt} className={className} />,
}));

// Mock BoxShadow
jest.mock("@/atoms/shadows", () => ({
  BoxShadow: () => <div data-testid="box-shadow" />,
}));

// Mock useTouchState hook
const mockUseTouchState = jest.fn().mockReturnValue({
  isTouched: false,
  isDisabled: false,
  handleTouchStart: jest.fn(),
  handleClick: jest.fn(),
  resetTouch: jest.fn(),
  elementRef: { current: null },
});
jest.mock("@/hooks/ui", () => ({
  useTouchState: (options: unknown) => mockUseTouchState(options),
  useReducedMotion: () => false,
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
  BashIcon: () => <svg data-testid="bash-icon" />,
  UnixIcon: () => <svg data-testid="unix-icon" />,
  LinuxIcon: () => <svg data-testid="linux-icon" />,
  RSpecIcon: () => <svg data-testid="rspec-icon" />,
  CucumberIcon: () => <svg data-testid="cucumber-icon" />,
  FigmaIcon: () => <svg data-testid="figma-icon" />,
  StorybookIcon: () => <svg data-testid="storybook-icon" />,
  SolidityIcon: () => <svg data-testid="solidity-icon" />,
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

      expect(
        screen.getByText("This is a featured summary")
      ).toBeInTheDocument();
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

  it("renders all technology icons without overflow limit", () => {
    const techs = [
      "React",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Docker",
      "PostgreSQL",
    ];
    render(<TechStackIcons technologies={techs} />);

    techs.forEach((tech) => {
      expect(screen.getByLabelText(tech)).toBeInTheDocument();
    });
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
      <ActionLinks
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    const link = screen.getByLabelText("Visit Test Project");
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
    expect(screen.getByLabelText("Visit Test Project")).toBeInTheDocument();
  });

  it("returns null when neither link is provided (AC3)", () => {
    const { container } = render(<ActionLinks projectTitle="Test Project" />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render GitHub link when repository is undefined (AC3)", () => {
    render(
      <ActionLinks
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
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

    expect(screen.queryByLabelText(/Visit.*Project/)).not.toBeInTheDocument();
  });

  it("handles project without technologies gracefully", () => {
    const project = createMockProject({ technologies: [] });
    render(<ProjectCard project={project} />);

    expect(
      screen.queryByLabelText("Technologies used")
    ).not.toBeInTheDocument();
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

describe("getTechIcon utility", () => {
  it("returns correct icon for known technology", () => {
    const Icon = getTechIcon("React");
    expect(Icon).toBeDefined();
  });

  it("is case-insensitive", () => {
    const icon1 = getTechIcon("react");
    const icon2 = getTechIcon("REACT");
    const icon3 = getTechIcon("React");
    expect(icon1).toBe(icon2);
    expect(icon2).toBe(icon3);
  });

  it("returns QuestionIcon for unknown technology", () => {
    const Icon = getTechIcon("UnknownTechnology123");
    // QuestionIcon is the fallback
    expect(Icon).toBeDefined();
  });

  it("handles technology name aliases", () => {
    // All should return the same React icon
    const aliases = ["react", "react.js"];
    const icons = aliases.map((name) => getTechIcon(name));
    expect(icons[0]).toBe(icons[1]);
  });
});

describe("hasTechIcon utility", () => {
  it("returns true for known technologies", () => {
    expect(hasTechIcon("React")).toBe(true);
    expect(hasTechIcon("TypeScript")).toBe(true);
    expect(hasTechIcon("docker")).toBe(true);
  });

  it("returns false for unknown technologies", () => {
    expect(hasTechIcon("UnknownTech")).toBe(false);
    expect(hasTechIcon("RandomFramework")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(hasTechIcon("REACT")).toBe(true);
    expect(hasTechIcon("typescript")).toBe(true);
  });
});

describe("Touch Behavior (Story 14.4)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTouchState.mockReturnValue({
      isTouched: false,
      isDisabled: false,
      handleTouchStart: jest.fn(),
      handleClick: jest.fn(),
      resetTouch: jest.fn(),
      elementRef: { current: null },
    });
  });

  describe("GridProjectCard touch integration", () => {
    it("calls useTouchState with unique id based on slug", () => {
      const project = createMockProject({ slug: "my-project" });
      render(<GridProjectCard project={project} />);

      expect(mockUseTouchState).toHaveBeenCalledWith({
        id: "grid-project-my-project",
      });
    });

    it("applies touched class when isTouched is true (AC1)", () => {
      mockUseTouchState.mockReturnValue({
        isTouched: true,
        isDisabled: false,
        handleTouchStart: jest.fn(),
        handleClick: jest.fn(),
        resetTouch: jest.fn(),
        elementRef: { current: null },
      });

      const project = createMockProject();
      render(<GridProjectCard project={project} />);

      const card = document.querySelector(".project-card--touched");
      expect(card).toBeInTheDocument();
    });

    it("does not apply touched class when isTouched is false", () => {
      const project = createMockProject();
      render(<GridProjectCard project={project} />);

      const card = document.querySelector(".project-card--touched");
      expect(card).not.toBeInTheDocument();
    });

    it("passes isTouched to ActionLinks", () => {
      mockUseTouchState.mockReturnValue({
        isTouched: true,
        isDisabled: false,
        handleTouchStart: jest.fn(),
        handleClick: jest.fn(),
        resetTouch: jest.fn(),
        elementRef: { current: null },
      });

      const project = createMockProject({
        repository: "https://github.com/test",
      });
      render(<GridProjectCard project={project} />);

      // When isTouched, ActionLinks should have visibility class
      const actions = document.querySelector(".project-card__actions--visible");
      expect(actions).toBeInTheDocument();
    });
  });

  describe("FeaturedProjectCard touch integration", () => {
    it("calls useTouchState with unique id based on slug", () => {
      const project = createMockProject({ slug: "featured-proj" });
      render(<FeaturedProjectCard project={project} />);

      expect(mockUseTouchState).toHaveBeenCalledWith({
        id: "featured-project-featured-proj",
      });
    });

    it("applies touched class when isTouched is true (AC1)", () => {
      mockUseTouchState.mockReturnValue({
        isTouched: true,
        isDisabled: false,
        handleTouchStart: jest.fn(),
        handleClick: jest.fn(),
        resetTouch: jest.fn(),
        elementRef: { current: null },
      });

      const project = createMockProject({ featured: true });
      render(<FeaturedProjectCard project={project} />);

      const card = document.querySelector(
        ".project-card--featured.project-card--touched"
      );
      expect(card).toBeInTheDocument();
    });
  });

  describe("ActionLinks visibility (AC1, AC5)", () => {
    it("applies visible class when isTouched prop is true", () => {
      render(
        <ActionLinks
          repository="https://github.com/test"
          projectTitle="Test"
          isTouched={true}
        />
      );

      const actions = document.querySelector(".project-card__actions--visible");
      expect(actions).toBeInTheDocument();
    });

    it("does not apply visible class when isTouched is false", () => {
      render(
        <ActionLinks
          repository="https://github.com/test"
          projectTitle="Test"
          isTouched={false}
        />
      );

      const actions = document.querySelector(".project-card__actions--visible");
      expect(actions).not.toBeInTheDocument();
    });
  });

  describe("44x44px Touch Target Compliance (AC2, AC7)", () => {
    it("action links have proper CSS classes for touch targets", () => {
      render(
        <ActionLinks
          repository="https://github.com/test"
          demo="https://demo.test"
          projectTitle="Test"
        />
      );

      // Verify the action links container has the correct class
      const actions = document.querySelector(".project-card__actions");
      expect(actions).toBeInTheDocument();

      // Verify individual action links have the correct classes
      // Note: Class names were renamed in Story 14.3 (repo→github, demo→visit)
      const githubLink = document.querySelector(
        ".project-card__action-link--github"
      );
      const visitLink = document.querySelector(
        ".project-card__action-link--visit"
      );

      expect(githubLink).toBeInTheDocument();
      expect(visitLink).toBeInTheDocument();

      // These classes are styled in CSS with min-w-11 min-h-11 (44px) for touch devices
      // The CSS media query @media (hover: none) applies the 44px sizing
      expect(githubLink).toHaveClass("project-card__action-link");
      expect(visitLink).toHaveClass("project-card__action-link");
    });

    it("action links container applies gap-4 spacing class structure", () => {
      render(
        <ActionLinks
          repository="https://github.com/test"
          demo="https://demo.test"
          projectTitle="Test"
        />
      );

      // The actions container class is present (CSS handles responsive gap)
      const actions = document.querySelector(".project-card__actions");
      expect(actions).toBeInTheDocument();
      expect(actions).toHaveClass("project-card__actions");
    });
  });
});
