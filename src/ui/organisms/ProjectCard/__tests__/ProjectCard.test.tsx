import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ProjectModel } from "@/domains/project/model/schema";
import { ProjectCard, FeaturedProjectCard, GridProjectCard } from "../index";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import { getTechIcon, hasTechIcon } from "../utils/getTechIcon";
import { trackEvent } from "@/services/analytics";

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

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

jest.mock("@/services/analytics", () => ({
  trackEvent: jest.fn(),
}));

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

jest.mock("@/state/slices/chatPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: false, closeChatPanel: jest.fn() }),
}));

jest.mock("@/state/slices/menuPanel/hooks", () => ({
  __esModule: true,
  default: () => ({ isOpen: false, closeMenuPanel: jest.fn() }),
}));

// Mock icons (direct imports — no barrel, inlined for jest.mock hoisting)
jest.mock("@/atoms/icons/GitHubIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="github-icon" />,
}));
jest.mock("@/atoms/icons/ReactIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="react-icon" />,
}));
jest.mock("@/atoms/icons/TypeScriptIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="typescript-icon" />,
}));
jest.mock("@/atoms/icons/NextIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="next-icon" />,
}));
jest.mock("@/atoms/icons/NodeIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="node-icon" />,
}));
jest.mock("@/atoms/icons/TailwindIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="tailwind-icon" />,
}));
jest.mock("@/atoms/icons/QuestionIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="question-icon" />,
}));
jest.mock("@/atoms/icons/PostgresIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="postgres-icon" />,
}));
jest.mock("@/atoms/icons/DockerIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="docker-icon" />,
}));
jest.mock("@/atoms/icons/JavaScriptIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="javascript-icon" />,
}));
jest.mock("@/atoms/icons/HTML5Icon", () => ({
  __esModule: true,
  default: () => <svg data-testid="html5-icon" />,
}));
jest.mock("@/atoms/icons/CSS3Icon", () => ({
  __esModule: true,
  default: () => <svg data-testid="css3-icon" />,
}));
jest.mock("@/atoms/icons/SASSIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="sass-icon" />,
}));
jest.mock("@/atoms/icons/ReduxIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="redux-icon" />,
}));
jest.mock("@/atoms/icons/GraphQLIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="graphql-icon" />,
}));
jest.mock("@/atoms/icons/MongoIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="mongo-icon" />,
}));
jest.mock("@/atoms/icons/RedisIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="redis-icon" />,
}));
jest.mock("@/atoms/icons/GitIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="git-icon" />,
}));
jest.mock("@/atoms/icons/RubyIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="ruby-icon" />,
}));
jest.mock("@/atoms/icons/RailsIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="rails-icon" />,
}));
jest.mock("@/atoms/icons/SvelteIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="svelte-icon" />,
}));
jest.mock("@/atoms/icons/RustIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="rust-icon" />,
}));
jest.mock("@/atoms/icons/KafkaIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="kafka-icon" />,
}));
jest.mock("@/atoms/icons/JenkinsIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="jenkins-icon" />,
}));
jest.mock("@/atoms/icons/TerraformIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="terraform-icon" />,
}));
jest.mock("@/atoms/icons/HerokuIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="heroku-icon" />,
}));
jest.mock("@/atoms/icons/BashIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="bash-icon" />,
}));
jest.mock("@/atoms/icons/UnixIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="unix-icon" />,
}));
jest.mock("@/atoms/icons/LinuxIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="linux-icon" />,
}));
jest.mock("@/atoms/icons/RSpecIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="rspec-icon" />,
}));
jest.mock("@/atoms/icons/CucumberIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="cucumber-icon" />,
}));
jest.mock("@/atoms/icons/FigmaIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="figma-icon" />,
}));
jest.mock("@/atoms/icons/StorybookIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="storybook-icon" />,
}));
jest.mock("@/atoms/icons/SolidityIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="solidity-icon" />,
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

    it("applies featured context typography class to grid metadata line", () => {
      const project = createMockProject({ tags: "Full Stack" });
      render(<GridProjectCard project={project} />);

      expect(screen.getByTestId("project-card-tags")).toHaveClass(
        "project-card__context-line"
      );
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

    it("renders floating tech chips inside the image overlay", () => {
      const project = createMockProject({
        technologies: ["React", "TypeScript"],
      });
      render(<GridProjectCard project={project} />);

      const imageLink = screen.getByTestId("project-card-image-link");
      const content = screen.getByTestId("project-card-content");
      const techStack = screen.getByTestId("project-card-tech-stack");

      expect(imageLink).toContainElement(techStack);
      expect(content).not.toContainElement(techStack);
    });

    it("renders image ribbon when ribbon metadata exists", () => {
      const project = createMockProject({
        featuredCard: {
          ribbon: {
            text: "Incoming",
            variant: "default",
          },
        },
      });

      render(<GridProjectCard project={project} />);

      const imageLink = screen.getByTestId("project-card-image-link");
      const ribbon = screen.getByTestId("project-card-image-ribbon");

      expect(imageLink).toContainElement(ribbon);
      expect(ribbon).toHaveTextContent("Incoming");
    });

    it("does not render image ribbon when ribbon metadata is missing", () => {
      const project = createMockProject({
        featuredCard: undefined,
      });

      render(<GridProjectCard project={project} />);

      expect(
        screen.queryByTestId("project-card-image-ribbon")
      ).not.toBeInTheDocument();
    });

    it("renders ribbon text that matches metadata", () => {
      const project = createMockProject({
        featuredCard: {
          ribbon: {
            text: "Work in Progress",
            variant: "wip",
          },
        },
      });

      render(<GridProjectCard project={project} />);

      expect(screen.getByTestId("project-card-image-ribbon")).toHaveTextContent(
        "Work in Progress"
      );
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

    it("renders featured hierarchy with floating tech stack on preview", () => {
      const project = createMockProject({
        featured: true,
        screenshots: ["/images/preview.jpg"],
        tags: "B2B SaaS • Workflow Engine",
        summary: "System-level orchestration for operations teams.",
        technologies: ["React", "TypeScript"],
        repository: "https://github.com/example/repo",
        demo: "https://demo.example.com",
        featuredCard: {
          contextBadges: ["B2B SaaS", "Workflow Engine"],
          ribbon: {
            text: "Work in Progress",
            variant: "wip",
          },
          architecture: {
            image: "/images/architecture.jpg",
            caption: "Queue + workers + API gateway",
          },
        },
      });

      render(<FeaturedProjectCard project={project} />);

      const preview = screen.getByTestId("project-card-image-link");
      const context = screen.getByTestId("project-card-context");
      const title = screen.getByTestId("project-card-title");
      const summary = screen.getByTestId("project-card-summary");
      const ribbon = screen.getByTestId("project-card-image-ribbon");
      const techStack = screen.getByTestId("project-card-tech-stack");
      const actions = screen.getByTestId("project-card-actions");

      expect(
        preview.compareDocumentPosition(context) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(
        context.compareDocumentPosition(title) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(
        title.compareDocumentPosition(summary) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(preview).toContainElement(ribbon);
      expect(ribbon).toHaveClass("project-card__image-ribbon--wip");
      expect(preview).toContainElement(techStack);
      expect(
        summary.compareDocumentPosition(actions) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it("does not render image ribbon when ribbon data is absent", () => {
      const project = createMockProject({
        featured: true,
        featuredCard: {
          contextBadges: ["B2B SaaS"],
        },
      });

      render(<FeaturedProjectCard project={project} />);

      expect(
        screen.queryByTestId("project-card-image-ribbon")
      ).not.toBeInTheDocument();
    });

    it("renders focus microline only when focus text exists", () => {
      const withFocus = createMockProject({
        featured: true,
        featuredCard: {
          focusLine: "Focus: optimize transactional reliability.",
        },
      });

      const { rerender } = render(<FeaturedProjectCard project={withFocus} />);

      expect(screen.getByTestId("project-card-focus-line")).toHaveTextContent(
        "Focus: optimize transactional reliability."
      );

      const withoutFocus = createMockProject({
        featured: true,
        featuredCard: {
          focusLine: "",
        },
      });

      rerender(<FeaturedProjectCard project={withoutFocus} />);

      expect(
        screen.queryByTestId("project-card-focus-line")
      ).not.toBeInTheDocument();
    });

    it("falls back to legacy featured content and preview-based architecture action", () => {
      const project = createMockProject({
        featured: true,
        tags: "Marketplace Systems • Web3 • Ethereum",
        summary: "Legacy summary fallback remains visible.",
        featuredCard: undefined,
      });

      render(<FeaturedProjectCard project={project} />);

      expect(
        screen.getByText("Marketplace Systems • Web3 • Ethereum")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Legacy summary fallback remains visible.")
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("project-card-focus-line")
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /Open architecture view for Test Project/i,
        })
      ).toBeInTheDocument();
    });

    it("uses preview image as architecture modal placeholder when metadata is missing", () => {
      const project = createMockProject({
        featured: true,
        screenshots: ["/images/preview-as-architecture.jpg"],
        featuredCard: undefined,
      });

      render(<FeaturedProjectCard project={project} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /Open architecture view for Test Project/i,
        })
      );

      const placeholderImage = screen.getByAltText(
        "Preview-based architecture placeholder for Test Project"
      );
      expect(placeholderImage).toHaveAttribute(
        "src",
        "/images/preview-as-architecture.jpg"
      );
      expect(
        screen.getByText(
          "Architecture diagram pending. Using project preview as placeholder."
        )
      ).toBeInTheDocument();
    });

    it("opens and closes architecture overlay and restores action focus", async () => {
      const project = createMockProject({
        featured: true,
        featuredCard: {
          architecture: {
            image: "/images/architecture.jpg",
            alt: "Architecture diagram",
            caption: "Architecture caption",
          },
        },
      });

      render(<FeaturedProjectCard project={project} />);

      const architectureAction = screen.getByRole("button", {
        name: /Open architecture view for Test Project/i,
      });

      architectureAction.focus();
      fireEvent.click(architectureAction);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByTestId("project-architecture-overlay")
      ).toBeInTheDocument();
      expect(screen.getByText("Architecture caption")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("project-architecture-overlay-close"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("project-architecture-overlay-close")
        ).not.toBeInTheDocument();
      });
      expect(architectureAction).toHaveFocus();
    });

    it("renders featured technologies as icons with hover tooltips", () => {
      const project = createMockProject({
        featured: true,
        technologies: [
          "React",
          "Tailwind",
          "JavaScript",
          "Context API",
          "React Router",
        ],
      });

      render(<FeaturedProjectCard project={project} />);

      [
        "React",
        "Tailwind",
        "JavaScript",
        "Context API",
        "React Router",
      ].forEach((tech) => {
        const icon = screen.getByLabelText(tech);
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("title", tech);
      });
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

  it("renders icon mode for featured variant", () => {
    render(
      <TechStackIcons
        technologies={["React", "Context API", "React Router"]}
        variant="featured"
      />
    );

    expect(screen.getByLabelText("React")).toHaveAttribute("title", "React");
    expect(screen.getByLabelText("Context API")).toHaveAttribute(
      "title",
      "Context API"
    );
    expect(screen.getByLabelText("React Router")).toHaveAttribute(
      "title",
      "React Router"
    );
  });
});

describe("ActionLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Source Code link when repository is provided", () => {
    render(
      <ActionLinks
        repository="https://github.com/example/repo"
        projectTitle="Test Project"
      />
    );

    const link = screen.getByRole("link", {
      name: /Open source code for Test Project/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/example/repo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.queryByText("Source Code")).not.toBeInTheDocument();
  });

  it("renders Source Code as GitHub icon link in featured variant", () => {
    render(
      <ActionLinks
        repository="https://github.com/example/repo"
        projectTitle="Test Project"
        variant="featured"
      />
    );

    const link = screen.getByTestId("project-card-action-source");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/example/repo");
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.queryByText("Source Code")).not.toBeInTheDocument();
  });

  it("renders Live Demo link when demo is provided", () => {
    render(
      <ActionLinks
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    const link = screen.getByRole("link", {
      name: /Open live demo for Test Project/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://demo.example.com");
  });

  it("applies inverse contrast style to Live Demo in grid variant", () => {
    render(
      <ActionLinks
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    expect(screen.getByTestId("project-card-action-demo")).toHaveClass(
      "project-card__action-link--demo-inverse"
    );
  });

  it("applies inverse contrast style to Live Demo in featured variant", () => {
    render(
      <ActionLinks
        demo="https://demo.example.com"
        projectTitle="Test Project"
        variant="featured"
      />
    );

    expect(screen.getByTestId("project-card-action-demo")).toHaveClass(
      "project-card__action-link--demo-inverse"
    );
  });

  it("renders fixed semantic labels when all targets are available", () => {
    render(
      <ActionLinks
        architectureTarget={{ image: "/images/architecture.jpg" }}
        repository="https://github.com/example/repo"
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    expect(
      screen.getByRole("button", {
        name: /Open architecture view for Test Project/i,
      })
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Open source code for Test Project/i })
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Open live demo for Test Project/i })
    ).toBeVisible();
  });

  it("keeps featured action order as Architecture, Source icon, Live Demo", () => {
    render(
      <ActionLinks
        architectureTarget={{ image: "/images/architecture.jpg" }}
        repository="https://github.com/example/repo"
        demo="https://demo.example.com"
        projectTitle="Test Project"
        variant="featured"
      />
    );

    const architecture = screen.getByTestId("project-card-action-architecture");
    const source = screen.getByTestId("project-card-action-source");
    const demo = screen.getByTestId("project-card-action-demo");

    expect(
      architecture.compareDocumentPosition(source) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      source.compareDocumentPosition(demo) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("returns null when neither link is provided (AC3)", () => {
    const { container } = render(<ActionLinks projectTitle="Test Project" />);
    expect(container.firstChild).toBeNull();
  });

  it("filters out actions with missing or unusable targets", () => {
    render(
      <ActionLinks
        architectureTarget={{ image: "" }}
        repository="notaurl"
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    expect(
      screen.queryByRole("button", {
        name: /Open architecture view for Test Project/i,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Open source code for Test Project/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open live demo for Test Project/i })
    ).toBeVisible();
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

  it("tracks demo clicks with project title and href", () => {
    render(
      <ActionLinks
        demo="https://demo.example.com"
        projectTitle="Test Project"
      />
    );

    fireEvent.click(screen.getByTestId("project-card-action-demo"));

    expect(trackEvent).toHaveBeenCalledWith("project_demo_click", {
      href: "https://demo.example.com",
      label: "Test Project",
    });
  });

  it("tracks architecture clicks with project title", () => {
    render(
      <ActionLinks
        architectureTarget={{ image: "/images/architecture.jpg" }}
        projectTitle="Test Project"
      />
    );

    fireEvent.click(screen.getByTestId("project-card-action-architecture"));

    expect(trackEvent).toHaveBeenCalledWith("project_architecture_click", {
      label: "Test Project",
    });
  });
});

describe("Edge Cases (AC3)", () => {
  it("handles project without repository gracefully", () => {
    const project = createMockProject({ repository: undefined });
    render(<ProjectCard project={project} />);

    expect(
      screen.queryByRole("link", { name: "Source Code" })
    ).not.toBeInTheDocument();
  });

  it("handles project without demo gracefully", () => {
    const project = createMockProject({ demo: undefined });
    render(<ProjectCard project={project} />);

    expect(
      screen.queryByRole("link", { name: "Live Demo" })
    ).not.toBeInTheDocument();
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
      const sourceLink = document.querySelector(
        ".project-card__action-link--source"
      );
      const demoLink = document.querySelector(
        ".project-card__action-link--demo"
      );

      expect(sourceLink).toBeInTheDocument();
      expect(demoLink).toBeInTheDocument();

      // These classes are styled in CSS with min-w-11 min-h-11 (44px) for touch devices
      // The CSS media query @media (hover: none) applies the 44px sizing
      expect(sourceLink).toHaveClass("project-card__action-link");
      expect(demoLink).toHaveClass("project-card__action-link");
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
