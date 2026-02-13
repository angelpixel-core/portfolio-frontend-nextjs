/**
 * Storybook-only fake article mock data (Lorem Ipsum)
 * Replaces real article data via NormalModuleReplacementPlugin
 *
 * Constraints:
 * - Min 3 featured (FeaturedArticlesCarousel needs 3)
 * - Min 1 non-featured (ArticleCard Grid story)
 * - Min 1 with content.length > 200 (ArticleContent story)
 * - All published_at in the past (article model filters future dates)
 * - All status: "published" (article model filters drafts)
 */
import type { Articles } from "@/domains/article/model/schema";

const LOREM_CONTENT = `# Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Duis Aute Irure

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

\`\`\`typescript
const lorem = (ipsum: string): string => {
  return ipsum.split("").reverse().join("");
};

export default lorem;
\`\`\`

## Sed Ut Perspiciatis

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

> Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.`;

const articlesMock: Articles = [
  {
    id: 1,
    title: "Lorem Ipsum Dolor Sit Amet Consectetur",
    url: "/articles/lorem-ipsum-dolor",
    slug: "lorem-ipsum-dolor",
    reading_time: "9 min read",
    published_at: "2023-03-22",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    content: LOREM_CONTENT,
    img: "/images/articles/pagination component in reactjs.jpg",
    featured: true,
    status: "published",
  },
  {
    id: 2,
    title: "Ut Enim Ad Minim Veniam Quis Nostrud",
    url: "/articles/ut-enim-ad-minim",
    slug: "ut-enim-ad-minim",
    reading_time: "5 min read",
    published_at: "2023-03-20",
    summary:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    content: LOREM_CONTENT,
    img: "/images/articles/create loading screen in react js.jpg",
    featured: true,
    status: "published",
  },
  {
    id: 3,
    title: "Duis Aute Irure Dolor In Reprehenderit",
    url: "/articles/duis-aute-irure",
    slug: "duis-aute-irure",
    reading_time: "7 min read",
    published_at: "2023-03-18",
    summary:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    content: LOREM_CONTENT,
    img: "/images/articles/form validation in reactjs using custom react hook.png",
    featured: true,
    status: "published",
  },
  {
    id: 4,
    title: "Excepteur Sint Occaecat Cupidatat Non",
    url: "/articles/excepteur-sint",
    slug: "excepteur-sint",
    reading_time: "6 min read",
    published_at: "2023-03-15",
    summary:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    content: LOREM_CONTENT,
    img: "/images/articles/What is Redux with easy explanation.png",
    featured: false,
    status: "published",
  },
  {
    id: 5,
    title: "Sed Ut Perspiciatis Unde Omnis Iste",
    url: "/articles/sed-ut-perspiciatis",
    slug: "sed-ut-perspiciatis",
    reading_time: "8 min read",
    published_at: "2023-03-12",
    summary:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    content: LOREM_CONTENT,
    img: "/images/articles/create modal component in react using react portals.png",
    featured: true,
    status: "published",
  },
  {
    id: 6,
    title: "Nemo Enim Ipsam Voluptatem Quia Voluptas",
    url: "/articles/nemo-enim-ipsam",
    slug: "nemo-enim-ipsam",
    reading_time: "4 min read",
    published_at: "2023-03-10",
    summary:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur.",
    img: "/images/articles/smooth scrolling in reactjs.png",
    featured: false,
    status: "published",
  },
  {
    id: 7,
    title: "At Vero Eos Et Accusamus Et Iusto Odio",
    url: "/articles/at-vero-eos",
    slug: "at-vero-eos",
    reading_time: "10 min read",
    published_at: "2023-03-08",
    summary:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
    content: LOREM_CONTENT,
    img: "/images/articles/todo list app built using react redux and framer motion.png",
    featured: false,
    status: "published",
  },
  {
    id: 8,
    title: "Temporibus Autem Quibusdam Et Aut Officiis",
    url: "/articles/temporibus-autem",
    slug: "temporibus-autem",
    reading_time: "3 min read",
    published_at: "2023-03-05",
    summary:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.",
    img: "/images/articles/What is higher order component in React.jpg",
    featured: false,
    status: "published",
  },
];

export default articlesMock;
