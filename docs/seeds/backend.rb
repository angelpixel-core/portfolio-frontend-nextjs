PUBLIC_PATH = "@public"
PUBLIC_LOGO_PATH = "#{PUBLIC_PATH}/%s"

IMAGE_PATH = "@images"
IMAGE_PROFILE_PATH = "#{IMAGE_PATH}/profile/%s"
IMAGE_CUSTOMERS_PATH = "#{IMAGE_PATH}/customers/%s"
IMAGE_PROJECTS_PATH = "#{IMAGE_PATH}/projects/%s"
IMAGE_ARTICLES_PATH = "#{IMAGE_PATH}/articles/%s"

ICONS_PATH = "@icons/%s/index.svg"

application = Site::Application.create!(
  name: "demo",
  code: "RZ1",
  email: "site@company.com"
).tap do |app, avatar_url = "hero.png"|
  app.avatar.attach(**Utils::Attachment.(IMAGE_PROFILE_PATH % avatar_url))
    app.avatar.save!
end
puts "🈸 Site::Application #{application.code} successfully created"

logo = Site::Logo.create!(
  application:,
  name: "Company",
  label: "Demo RZI Label"
).tap do |logo, avatar_url = "logo-214x214.svg"|
  logo.avatar.attach(**Utils::Attachment.(PUBLIC_LOGO_PATH % avatar_url))
    logo.avatar.save!
end
puts "🛡 Site::Logo #{logo.label} successfully created"

user = IAM::User.create!(
  applicable: application,
  email: "visitor@example.com",
  name: "visitor"
)
puts "👽 IAM::User (#{user.name.capitalize}) successfully created"

account = IAM::Account.create!(
  user:,
  email: user.email,
  password: "12345678"
)
puts "💳 IAM::Account (#{account.email}) successfully created"

hero = Site::Hero.build(
  application:,
  nickname: "elvis",
  biography: [
    "Hi, I'm Angel Szymczak, a Full Stack Web Developer passionate about creating beautiful, functional, goal-driven, and user-centric digital experiences.",
    "With 6 years of experience in the field. I am always looking for new and innovative ways to bring my clients' visions to life.",
    "I believe that design is about more than just making things look pretty.",
    "it's about solving problems and creating intuitive, enjoyable experiences for users.",
    "Whether I'm working on a website, frontend, backend, distributed systems, or other digital product, I bring my commitment to quality excellence and user-centered thinking to every project I work on. I look forward to the opportunity to bring my skills and passion to your next project."
  ].join("\n")
).tap do |site_hero, avatar_url = "hero.png"|
  site_hero.avatar.attach(**Utils::Attachment.(IMAGE_PROFILE_PATH % avatar_url))
  site_hero.avatar.save!
end
puts "🕺 Site::Hero (#{hero.nickname}) for application #{application.code.upcase} successfully created"

_contact_types = [
  [
    "address",
    :location,
    "123 Amazing St,
    Amazing City, AM",
    "MapPin",
    "",
    :active
  ],
  [
    "map",
    :location,
    "https://goo.gl/maps/example",
    "Map",
    "",
    :active
  ],
  [
    "phone",
    :messaging,
    "123-456-7890",
    "Phone",
    "",
    :active
  ],
  [
    "email",
    :mail,
    "contact@amazingcompany.com",
    "Email",
    "",
    :active
  ],
  [
    "resume",
    :personal,
    "https://docs.google.com/document/d/link-1234",
    "DocumentText",
    "",
    :active
  ],
  [
    "calendar",
    :scheduling,
    "https://calendly.com/es",
    "Calendar",
    "",
    :active
  ],
  [
    "whatsapp",
    :messaging,
    "124-333-4445",
    "WhatsApp",
    "",
    :active
  ],
  [
    "telegram",
    :messaging,
    "https://t.me/articangel",
    "Telegram",
    "bg-primaryTelegram dark:bg-primaryDarkTelegram text-primaryDarkTelegram dark:text-primaryTelegram rounded-full",
    :active
  ],
  [
    "pinterest",
    :social,
    "https:/pinterest.com/articangel",
    "Pinterest",
    "bg-light",
    :inactive
  ],
  [
    "dribbble",
    :social,
    "https:/dribbble.com/articangel",
    "Dribbble",
    "",
    :inactive
  ],
  [
    "github",
    :social,
    "https://github.com/amazingdev",
    "GitHub",
    "bg-primaryDarkGitHub dark:bg-primaryGitHub text-primaryGitHub dark:text-primaryDarkGitHub rounded-full",
    :active
  ],
  [
    "linkedin",
    :social,
    "https://linkedin.com/in/angelszymczak",
    "LinkedIn",
    "bg-primaryDarkLinkedIn dark:bg-primaryLinkedIn text-primaryLinkedIn dark:text-primaryDarkLinkedIn rounded-md",
    :active
  ],
  [
    "twitter",
    :social,
    "https://twitter.com/arcticangel",
    "Twitter",
    "",
    :active
  ]
]
  .map
  .with_index do |(name, type, value, icon_name, custom_styles, status), position| # api json {name, href, enabled, customStyles}
    Site::ContactPoint.create!(
      contactable: hero,
      type: Site::ContactPoint::TYPES[type],
      name:,
      icon_name:,
      value:,
      position:,
      custom_styles:,
      status: Site::ContactPoint::STATUSES[status],
    ).tap do |site_contact_point|
      # site_contact_point.avatar.attach(**Utils::Attachment.(ICONS_PATH % avatar_url))
      # site_contact_point.avatar.save!
    end
  end
puts "📞 Site::ContactPoint (#{Site::ContactPoint.count}) for hero #{hero.nickname.capitalize} successfully created"

_pages = [
  [
    "landing",
    "Turning Vision Into Code-Reality.",
    "/",
    :published,
    "As a skilled Full-Stack developer, I am dedicated to turning ideas into Scalable Web Solutions. Explore my latest projects and articles, showcasing my expertise in Ruby + Rails and HTML, CSS, JavaScrit + React/NextJS."
  ],
  [
    "about",
    "Passion Fuels Purpose!",
    "/about",
    :published,
    "no hay"
  ],
  [
    "portfolio",
    "Projects",
    "/portfolio",
    :published,
    "no hay"
  ],
  [
    "blog",
    "Articles",
    "/blog",
    :published,
    "no hay"
  ]
].map do |name, title, url, status, main_content|
  Site::Page.create!(
    application:,
    name:,
    title:,
    url:,
    status: Site::Page::STATUSES[status],
    main_content:
  )
end
puts "📄 Site::Page (#{Site::Page.count}) for hero #{hero.nickname.capitalize} successfully created"

_nav_links = [
  [ "landing", "Home", :active ],
  [ "about", "About", :active ],
  [ "portfolio", "Projects", :active ],
  [ "blog", "Articles", :active ]
].map
  .with_index do |(name, title, status), position|
    Site::NavLink
      .create!(
        application:,
        name:,
        title:,
        page: Site::Page.published.find_by(name:),
        status: Site::NavLink::STATUSES[status],
        position:
      )
  end
puts "🔗 Site::NavLink (#{Site::NavLink.count}) for hero #{hero.nickname.capitalize} successfully created"

_auth_link = [
  [ "SignIn", "/sessions/new", "Lock/Open", :active ],
  [ "SignOut", "/sessions", "Lock/Closed", :active ],
  [ "SignUp", "/registrations/new", "User/Plus", :active ]
].map do |name, url, avatar_url, status|
  Site::AuthLink.create!(
    application:,
    name:,
    title: name,
    url:,
    status: Site::AuthLink::STATUSES[status]
  ).tap do |link|
    # link.avatar.attach(**Utils::Attachment.call(ICONS_PATH % avatar_url))
    # link.avatar.save!
  end
end

_customers = [
  [
    "Consulting Service",
    "Software Solutions",
    "https://site.dev",
    "Remote",
    IMAGE_PROFILE_PATH % "hero.png",
    [ # Experience | position, start_date, end_date, tasks
      [
        "Independant",
        "Feb 2023",
        "Dec 2023",
        [
          [
            "I collaborated with Chief Technology Officers (CTOs), Product Owners, Project Managers and their teams to enhance their services platform.",
            [ "collaboration", "CTOs", "Product Owners", "Project Managers" ]
          ],
          [
            "The primary focus was on adding new features, planning deliveries, achieving new integrations, scaling solutions, improving security, defining task plans for developers, enhancing the overall end-user experience for web applications, and providing coaching for new team members.",
            [ "features", "deliveries", "integrations", "scaling", "security", "task plans", "coaching", "end-user experience" ]
          ]
        ]
      ]
    ]
  ],
  [
    "Compass",
    "Real Estate Brokerage",
    "https://compass.com",
    "New York, United States",
    IMAGE_CUSTOMERS_PATH % "compass.png",
    [
      [
        "FullStack Engineer",
        "Dec 2021",
        "Aug 2022",
        [
          [
            "A significant part of my role involved code maintenance and enhancement.",
            [ "code maintenance", "enhancement" ]
          ],
          [
            "I diligently removed and refactored code, addressing technical debt, and implemented feature flags to ensure a more flexible and adaptable codebase.",
            [ "technical debt", "feature flags", "flexible", "adaptable" ]
          ],
          [
            "Additionally, I delved into database query optimization, enhancing overall system performance, and actively participated in bug fixing to uphold system reliability.",
            [ "database query optimization", "system performance", "bug fixing", "reliability" ]
          ]
        ]
      ]
    ]
  ],
  [
    "SouthWorks",
    "Custom Software Development",
    "https://www.southworks.com",
    "Delawere, United States",
    IMAGE_CUSTOMERS_PATH % "southworks.png",
    [
      [
        "Software Engineer L3",
        "May 2020",
        "Sept 2021",
        [
          [
            "Incorporating leadership tasks, I took on a pivotal role in project management.",
            [ "leadership", "project management" ]
          ],
          [
            "This involved overseeing dashboards, assigning tasks, leading sprint planning sessions, and acting as a facilitator for delivering key milestones.",
            [ "dashboards", "sprint planning", "facilitator", "milestones" ]
          ],
          [
            "This multifaceted approach showcased not only technical acumen but also leadership and organizational skills in steering projects towards successful outcomes.",
            [ "technical acumen", "leadership", "organizational skills", "successful outcomes" ]
          ]
        ]
      ]
    ]
  ],
  [
    "Bitex",
    "B2B Crypto Marketplace",
    "https://bitex.la",
    "Amsterdam, Netherlands",
    IMAGE_CUSTOMERS_PATH % "bitex.png",
    [
      [
        "FullStack Developer",
        "Dec 2017",
        "May 2019",
        [
          [
            "I played a pivotal role in the financial technology sector, implementing strategic initiatives to enhance market operations and streamline asset management.",
            [ "financial technology", "strategic initiatives", "market operations", "asset management" ]
          ],
          [
            "Throughout these endeavors, my role involved a deep understanding of financial markets, strategic thinking in implementing automated trading strategies, and the creation of tools to streamline API interactions for efficient asset management.",
            [ "financial markets", "automated trading strategies", "API interactions", "asset management" ]
          ]
        ]
      ]
    ]
  ],
  [
    "Nubi",
    "Cross-Border Payments",
    "https://www.tunubi.com",
    "Buenos Aires, Argentina",
    IMAGE_CUSTOMERS_PATH % "nubi.png",
    [
      [
        "FullStack Engineer L2",
        "Sept 2019",
        "May 2020",
        [
          [
            "I spearheaded impactful initiatives, showcasing a blend of technical expertise and strategic problem-solving.",
            [ "leadership", "problem-solving", "technical" ]
          ],
          [
            "I proposed and successfully implemented an auditory asynchronous service, optimizing the entire transaction remittance processing workflow.",
            [ "optimization", "workflow" ]
          ],
          [
            "This innovation not only improved efficiency but also enhanced the reliability of transaction auditing.",
            [ "efficiency", "reliability" ]
          ],
          [
            "Recognizing the importance of regulatory compliance, I undertook the redesign of fee calculations, aligning them with Argentina's tax regulations.",
            [ "regulatory compliance", "tax regulations" ]
          ]
        ]
      ]
    ]
  ],
  [
    "UNLP",
    "Univeridad Nacional de La Plata",
    "https://www.unlp.com.ar",
    "Buenos Aires, Argentina",
    IMAGE_CUSTOMERS_PATH % "unlp.png",
    [
      [
        "Trainee",
        "Sept 2014",
        "May 2015",
        [
          [
            "meran metasearch",
            [ "leadership", "problem-solving", "technical" ]
          ],
          [
            "libretas estudiantiles",
            [ "optimization", "workflow" ]
          ],
          [
            "recibos de sueldo",
            [ "efficiency", "reliability" ]
          ],
          [
            "ETL OAI",
            [ "regulatory compliance", "tax regulations" ]
          ]
        ]
      ]
    ]
  ]
].map do |name, company_type, url, address, avatar_url, experiences|
  Site::Customer.create!(
    hero:,
    name:,
    company_type:,
    url:,
    address:
  ).tap do |customer|
    customer.avatar.attach(**Utils::Attachment.call(avatar_url))
    customer.avatar.save!

    experiences.each do |position, start_date, end_date, tasks|
      Site::Experience.create!(
        hero:,
        customer:,
        position:,
        start_date:,
        end_date:
      ).tap do |experience|
        tasks.each do |outcome, tags|
          Site::Task.create!(
            experience:,
            outcome:
          ).tap do |task|
            tags.each do |tech_type|
              task.add_tag(tech_type)
            end
          end
        end
      end
    end
  end
end
puts "👥 Site::Customer (#{Site::Customer.count}) for hero #{hero.nickname.capitalize} successfully created"

<<~CERTIFICATIONS
  Redis: https://university.redis.com/certification
  GitHub: https://resources.github.com/learn/certifications
  Linux: https://www.lpi.org/es/summary-of-certifications
  Diagrams: https://app.eraser.io
CERTIFICATIONS

_projects = [
  [
    "Crypto Screener Application",
    "A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your local currency.",
    "https://demo.com",
    "https://github.com/angelpixel-core/crypto-screener",
    IMAGE_PROJECTS_PATH % "incoming/crypto-screener.svg",
    [ "Back Office", "JavaScript", "React" ],
    true,
    Portfolio::Project::STATUSES[:published]
  ],
  [
    "Portfolio",
    "A professional portfolio website using NextJS, Framer-motion, and Styled-components. It has smooth page transitions, cool background effects, unique design and it is mobile responsive.",
    "https://demo.com",
    "https://github.com/angelpixel-core/portfolio",
    IMAGE_PROJECTS_PATH % "incoming/portfolio.svg",
    [ "Web Site", "JavaScript", "NextJS" ],
    false,
    Portfolio::Project::STATUSES[:published]
  ],
  [
    "Blog",
    "A blog website using Ruby on Rails, Tailwind CSS, and Stimulus Reflex. It has a clean design, a dark theme, and it is mobile responsive.",
    "https://demo.com",
    "https://github.com/angelpixel-core/blog",
    IMAGE_PROJECTS_PATH % "incoming/blog.svg",
    [ "Social Media", "JavaScript", "AstroJS" ],
    false,
    Portfolio::Project::STATUSES[:published]
  ],
  [
    "Marketplace",
    "A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth page transitions, cool background effects, unique design and it is mobile responsive.",
    "https://demo.com",
    "https://github.com/angelpixel-core/marketplace",
    IMAGE_PROJECTS_PATH % "incoming/marketplace.svg",
    [ "Ecommerce", "Ruby", "Rails", "RoR" ],
    true,
    Portfolio::Project::STATUSES[:published]
  ],
  [
    "React Dashboard BackOffice",
    "A professional dashboard backoffice website using React JS, Redux, and Styled-components. It has a clean design, a dark theme, and it is mobile responsive.",
    "https://demo.com",
    "https://github.com/angelpixel-core/dashboard-backoffice",
    IMAGE_PROJECTS_PATH % "incoming/nft-collection.svg",
    [ "Dashboard", "BackOffice", "JavaScript", "React" ],
    false,
    Portfolio::Project::STATUSES[:published]
  ],
  [
    "Rails UTM App",
    "A professional UTM App using Ruby on Rails, Tailwind CSS, and Stimulus Reflex. It has a clean design, a dark theme, and it is mobile responsive.",
    "https://demo.com",
    "https://github.com/angelpixel-core/utm-app",
    IMAGE_PROJECTS_PATH % "incoming/utm.svg",
    [ "UTM", "Ruby", "Rails" ],
    false,
    Portfolio::Project::STATUSES[:published]
  ]
].map do |title, summary, published_url, repository_url, avatar_url, tags, featured, status|
  Portfolio::Project.create!(
    application:,
    title:,
    summary:,
    published_url:,
    repository_url:,
    featured:,
    status:
  ).tap do |project|
    project.avatar.attach(**Utils::Attachment.call(avatar_url))
      project.avatar.save!

      project.tags = tags.map do |tech_type|
        Site::Tag.find_or_create_by(tech_type:)
      end
  end
end
puts "📦 Portfolio::Project (#{Portfolio::Project.count}) for hero #{hero.nickname.capitalize} successfully created"
puts "🏷️ Site::Tag (#{Site::Tag.count}) for application #{application.code.upcase} successfully created"

_academics = [
  [
    "Bachelor Of Science in Information Systems",
    "March 2013",
    "Dec 2017",
    "La Plata, Argentina (MIT)",
    "The program equips individuals to lead software projects, oversee thematic areas within organizations, guide the analysis of functional processes, and develop information systems. It encompasses planning technical-economic studies, defining metrics for software quality and security, conducting computer systems audits, and managing resource-focused projects. Graduates are prepared to teach computer science, engage in research within software and information systems, and lead research initiatives in the field.",
    [],
    []
  ],
  [
    "Cloud Platform Practitioner",
    "Nov 2020",
    "Dec 2020",
    "Amazon Web Services",
    "The AWS Certified Cloud Practitioner certification equips professionals with comprehensive cloud skills, ranging from the selection and management of services to the application of architectural principles and security practices. These skills are essential for building a solid foundation and advancing into more specialized roles within the AWS ecosystem.",
    [],
    []
  ],
  [
    "Backend Engineer",
    "Jan 2023",
    "Jun 2023",
    "Self-Taught Online Education",
    "Resume of specialization",
    [
      [
        "Object Oriented Programming",
        [ "Encapsulation", "Inheritance", "Polymorphism" ]
      ],
      [
        "Functional Programming",
        [ "Higher Order Functions", "Immutability" ]
      ],
      [
        "Reactive Programming",
        [ "Asynchronous Events Management", "ReactiveX" ]
      ],
      [
        "Design Patterns",
        [ "Singleton", "Factory", "Observer", "MVC", "ORM", "Facade" ]
      ],
      [
        "SOLID Principles",
        [ "Single Responsibility", "Open-Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion" ]
      ],
      [
        "Test Driven Development",
        [ "TDD", "RSpec", "Unit Test", "Integration Test", "Acceptance Test" ]
      ],
      [
        "Behaviour Driven Development",
        [ "Gherkins", "Cucumber", "Capybara" ]
      ],
      [
        "Domain Driven Development",
        [ "CQRS", "Ports & Adapters" ]
      ],
      [
        "Fundamentals",
        [ "SOLID", "DRY", "KISS", "YAGNO" ]
      ],
      [
        "Architect",
        [ "Monolithic", "Microservices", "Serverless", "API" ]
      ],
      [
        "Protocols",
        [ "Web Sockets", "REST", "GraphQL", "Service Workers" ]
      ]
    ],

    [
      [
        "Pogramming Languages",
        [ "Bash", "Ruby", "JavaScript" ]
      ],
      [
        "Frameworks",
        [ "Ruby on Rails", "Roda", "Nodejs", "AstroJS" ]
      ],
      [
        "Databases",
        [ "MySQL", "PostgreSQL", "MongoDB", "Redis" ]
      ],
      [
        "Event Streamming",
        [ "Kafka" ]
      ],
      [
        "User Centered Design",
        [ "Postman", "Apollo" ]
      ],
      [
        "Security",
        [ "OWASP", "Brakerman", "Snyk" ]
      ],
      [
        "Automation",
        [ "Capistrano", "Docker", "Jenkins", "GitHub Actions" ]
      ],
      [
        "Cloud Computing",
        [ "CI/CD", "Heroku", "AWS" ]
      ],
      [
        "Versioning Management",
        [ "Git" ]
      ],
      [
        "Documentation",
        [ "Swagger" ]
      ]
    ]
  ],
  [
    "Frontend Engineer",
    "Jul 2023",
    "Dec 2023",
    "Self-Taught Online Education",
    "Resume of specialization",
    [
      [
        "Web Design",
        [ "Responsive Design", "Atomic Design", "pixel perfect", "Dark Theme", "CSR", "SSR" ]
      ],
      [
        "Architect",
        [ "Web Components", "Single Page Application", "Parallax" ]
      ],
      [
        "Web Accessibility",
        [ "WCAG" ]
      ],
      [
        "Performance Optimization",
        [ "Lazy Loading", "Image Compression", "Query Optimization", "Fragment Caching", "Code Splitting" ]
      ]
    ],
    [
      [
        "Web Development",
        [ "HTML", "CSS", "JavaScript", "Media Query", "Flexbox", "Grid", "Figma", "Storybook" ]
      ],
      [
        "Frameworks",
        [ "SASS", "TailwindCSS", "Turbo", "HOTwire", "Stimulus", "React" ]
      ],
      [
        "Interactivity and Animation",
        [ "GSAP", "Framer Motion", "ThreeJS" ]
      ],
      [
        "Testing Frontend",
        [ "Cypress", "Jest" ]
      ],
      [
        "State Management",
        [ "Redux", "Contexts" ]
      ],
      [
        "Data Exchange Format",
        [ "JSON", "GraphQL" ]
      ],
      [
        "Security",
        [ "XSS", "CSRF" ]
      ]
    ]
  ]
].map do |degree, start_date, end_date, institution, resume, knowledges, specializations|
  Site::Academic.create!(
    hero:,
    degree:,
    start_date:,
    end_date:,
    institution:,
    resume:
  ).tap do |academic|
    knowledges.each do |title, concepts|
      academic.add_knowledge(title).tap do |knowledge|
        concepts.each do |concept|
          # TODO: Porfolio::Knowledge should be a subclass of Portfolio::Concept
          knowledge.add_concept(concept)
        end
      end
    end

      specializations.each do |title, concepts|
        academic.add_specialization(title).tap do |knowledge|
          concepts.each do |concept|
            # TODO: Porfolio::Specialization should be a subclass of Portfolio::Concept
            knowledge.add_concept(concept)
          end
        end
      end
  end
end
puts "🎓 Hero::Academic (#{Site::Academic.count}) for hero #{hero.nickname.capitalize} successfully created"
puts "📚 Site::Knowledge (#{Portfolio::Knowledge.count}) for hero #{hero.nickname.capitalize} successfully created"
puts "🔬 Site::Specialization (#{Portfolio::Specialization.count}) for hero #{hero.nickname.capitalize} successfully created"

_concepts = [
  "Web Development",
  "Frontend",
  "Backend",
  "Fullstack",
  "Software Engineering",
  "Web Design",
  "Web Accessibility",
  "Performance Optimization",
  "Web Security",
  "Web Architecture",
  "Web Protocols",
  "Web Technologies",
  "Web Frameworks",
  "Web Databases",
  "Web Event Streamming",
  "Web User Centered Design",
  "Web Automation",
  "Web Cloud Computing",
  "Web Versioning Management",
  "Web Documentation",
  "Web Testing",
  "Web State Management",
  "Web Data Exchange Format",
  "Web Interactivity and Animation",
  "Web Design Patterns",
  "Web SOLID Principles",
  "Web Fundamentals",
  "Web Architect"
].map do |name|
  Portfolio::Concept.create!(name:)
end
puts "📚 Portfolio::Concept (#{Portfolio::Concept.count}) for application #{application.code.upcase} successfully created"

_articles = [
  [
    "Build A Custom Pagination Component In Reactjs From Scratch",
    "/not-found",
    IMAGE_ARTICLES_PATH % "pagination component in reactjs.jpg",
    "9 min read",
    "March 22, 2023",
    Blog::Article::STATUSES[:published],
    true,
    "Learn how to build a custom pagination component in ReactJS from scratch. Follow this step-by-step guide to integrate Pagination component in your ReactJS project."
  ],
  [
    "Creating Stunning Loading Screens In React: Build 3 Types Of Loading Screens",
    "/not-found",
    IMAGE_ARTICLES_PATH % "create loading screen in react js.jpg",
    "10 min read",
    "March 22, 2023",
    Blog::Article::STATUSES[:published],
    true,
    "Learn how to create stunning loading screens in React with 3 different methods. Discover how to use React-Loading, React-Lottie & build a custom loading screen. Improve the user experience."
  ],
  [
    "Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling",
    "/not-found",
    IMAGE_ARTICLES_PATH % "form validation in reactjs using custom react hook.png",
    "12 min read",
    "March 22, 2023",
    Blog::Article::STATUSES[:published],
    false,
    ""
  ],
  [
    "Creating An Efficient Modal Component In React Using Hooks And Portals",
    "/not-found",
    IMAGE_ARTICLES_PATH % "create modal component in react using react portals.png",
    "10 min read",
    "March 22, 2023",
    Blog::Article::STATUSES[:published],
    false,
    ""
  ],
  [
    "Redux Simplified: A Beginner's Guide For Web Developers",
    "/not-found",
    IMAGE_ARTICLES_PATH % "What is Redux with easy explanation.png",
    "16 min read",
    "March 22, 2023",
    Blog::Article::STATUSES[:published],
    false,
    ""
  ],
  [
    "What Is Higher Order Component (Hoc) In React?",
    "/not-found",
    IMAGE_ARTICLES_PATH % "What is higher order component in React.jpg",
    "20 min read",
    "March 22, 2023",
    Blog::Article::STATUSES[:published],
    false,
    ""
  ]
].map do |title, url, avatar_url, reading_time, published_at, status, featured, summary|
  Blog::Article.create!(
    application:,
    title:,
    url:,
    reading_time:,
    published_at:,
    status:,
    featured:,
    summary:
  ).tap do |article|
    article.avatar.attach(**Utils::Attachment.call(avatar_url))
    article.avatar.save!
  end
end
puts "📰 Blog::Article (#{Blog::Article.count}) for application #{application.code.upcase} successfully created"

_technologies = [
  [ "Ruby", :active, "8vw", "0vw", 6, "senior" ],
  [ "Rails", :active, "6vw", "5vw", 6, "senior" ],
  [ "JavaScript", :active, "2vw", "8vw", 6, "senior" ],
  [ "Git", :active, "-2vw", "8vw", 6, "senior" ],
  [ "HTML5", :active, "-6vw", "5vw", 6, "senior" ],
  [ "CSS3", :active, "-8vw", "0vw", 6, "senior" ],
  [ "SASS", :active, "-6vw", "-5vw", 6, "senior" ],
  [ "Bash", :active, "-2vw", "-8vw", 6, "senior" ],
  [ "RSpec", :active, "2vw", "-8vw", 6, "senior" ],
  [ "Linux", :active, "6vw", "-5vw", 6, "senior" ],
  [ "WWW", :active, "0vw", "0vw", 6, "senior" ],

  [ "Docker", :active, "12vw", "7vw", 5, "senior" ],
  [ "AWS", :active, "7vw", "12vw", 5, "senior" ],
  [ "Postgre", :active, "-7vw", "12vw", 5, "senior" ],
  [ "Redis", :active, "-12vw", "7vw", 5, "senior" ],
  [ "GraphQL", :active, "-12vw", "-7vw", 5, "senior" ],
  [ "Cucumber", :active, "-7vw", "-12vw", 5, "senior" ],

  [ "React", :active, "14vw", "0vw", 3, "middle" ],
  [ "Redux", :active, "11vw", "9vw", 3, "middle" ],
  [ "Node", :active, "4vw", "13vw", 3, "middle" ],
  [ "Mongo", :active, "-4vw", "13vw", 3, "middle" ],
  [ "Kafka", :active, "-11vw", "9vw", 3, "middle" ],
  [ "Heroku", :active, "-14vw", "0vw", 3, "middle" ],
  [ "Figma", :active, "-11vw", "-9vw", 3, "middle" ],
  [ "Storybook", :active, "-4vw", "-13vw", 3, "middle" ],
  [ "Tailwind", :active, "4vw", "-13vw", 3, "middle" ],

  [ "Jenkins", :active, "13vw", "13vw", 1, "junior" ],
  [ "Svelte", :active, "-13vw", "13vw", 1, "junior" ],

  [ "TypeScript", :active, "10vw", "17vw", 0.5, "trainee" ],
  [ "Terraform", :active, "-10vw", "17vw", 0.5, "trainee" ],
  [ "Next", :active, "-20vw", "0vw", 0.5, "trainee" ],

  [ "Rust", :active, "11vw", "19vw", 0, "roadmap" ],
  [ "Solidity", :active, "-22vw", "0vw", 0, "roadmap" ]
].map do |name, status, x, y, years_of_experience, proficiency|
  # TODO: should be a subclass of Portfolio::Concept
  Portfolio::Technology.create!(
    hero:,
    name:,
    status: Portfolio::Technology::STATUSES[status],
    x:,
    y:,
    years_of_experience:,
    proficiency:
  ).tap do |article|
    # avatar_url = "@icons/#{name}/index.svg"
    # article.avatar.attach(**Utils::Attachment.(avatar_url))
    # article.avatar.save!
  end
end
puts "🔧 Portfolio::Technology (#{Portfolio::Technology.count}) for application #{application.code.upcase} successfully created"

_alerts = [
  [ "Available for hire – let’s connect!", :inactive, 30.days.ago ],
  [ "Ruby dev open to work — let’s build!", :active, 15.days.from_now ],
  [ "Exploring new opportunities — open to connect, collaborate, and create!", :active, 30.days.from_now ],
  [ "Ruby developer open to new challenges — let’s code, connect, and create together.", :inactive, Date.today ]
].each do |text, status, expires_at|
  Site::Alert.create!(application:, text:, status: Site::Alert::STATUSES[status], expires_at:)
end
puts "🚨 Site::Alert (#{Site::Alert.count}) for application #{application.code.upcase} successfully created"

10.times do
  start_time = Faker::Time.forward(days: 5, period: :morning)
  end_time = start_time + rand(1..3).hours

  Site::Event.create!(
    start_time: start_time,
    end_time: end_time,
    theme: Faker::Lorem.sentence(word_count: 10).capitalize,
    title: Faker::Marketing.buzzwords,
    status: Site::Event::STATUSES[:pending],
    start_time_link: Faker::Internet.url
  )
end
