# Content Management Guide

This guide explains how to add and update content in the portfolio.

## Projects

### Data Location

Projects are stored in: `src/domains/project/model/mock.ts`

This is the **canonical source** for all project data. The data is validated at runtime against the Zod schema defined in `schema.ts`.

### Adding a New Project

1. Open `src/domains/project/model/mock.ts`
2. Add a new object to the `projectsMock` array:

```typescript
{
  id: 4, // Unique numeric ID (increment from last)
  slug: "my-new-project", // URL-friendly identifier
  title: "My New Project", // Display title
  summary: "A brief one-line description.", // Short summary
  description: "Full detailed description of the project...", // Long description
  technologies: ["React", "TypeScript", "Tailwind"], // Tech stack array
  outcomes: "Key achievements or metrics.", // Optional
  demo: "https://demo-url.com", // Optional - must be valid URL
  repository: "https://github.com/user/repo", // Optional - must be valid URL
  img: "/images/projects/my-project.jpg", // Cover image path
  screenshots: ["/images/projects/screenshot1.jpg"], // Optional array
  tags: "Category • Tech • Type", // Display tags (bullet-separated)
  featured: false, // Show on homepage featured section
}
```

3. Add project images to `public/images/projects/`
4. Run validation: `npm run validate:projects`
5. Build and test: `npm run build`

### Updating an Existing Project

1. Open `src/domains/project/model/mock.ts`
2. Find the project by `slug` or `id`
3. Modify the desired fields
4. Run validation: `npm run validate:projects`
5. Build and test: `npm run build`

### Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | number | Unique identifier |
| `slug` | Yes | string | URL-friendly name (lowercase, hyphens) |
| `title` | Yes | string | Display title |
| `summary` | Yes | string | Brief one-line description |
| `description` | Yes | string | Full detailed description |
| `technologies` | Yes | string[] | Array of technology names |
| `img` | Yes | string | Cover image path |
| `tags` | Yes | string | Display tags (bullet-separated) |
| `featured` | Yes | boolean | Show in featured section |
| `outcomes` | No | string | Key achievements or metrics |
| `demo` | No | string (URL) | Live demo link |
| `repository` | No | string (URL) | Source code repository link |
| `screenshots` | No | string[] | Additional screenshot paths |

### Validation

Projects are validated using Zod schema. Common validation errors:

- **Invalid URL**: `demo` and `repository` must be valid URLs (https://...)
- **Missing required field**: All required fields must be present
- **Wrong type**: `technologies` must be an array, `featured` must be boolean

Run `npm run validate:projects` to check for errors before deploying.

## Articles

### Data Location

Articles are stored in: `src/domains/article/model/mock.ts`

This is the **canonical source** for all article data. The data is validated at runtime against the Zod schema defined in `schema.ts`.

### Adding a New Article

1. Open `src/domains/article/model/mock.ts`
2. Add a new object to the `articlesMock` array:

```typescript
{
  id: 6, // Unique numeric ID (increment from last)
  title: "My New Article Title", // Display title
  url: "/articles/my-new-article", // URL path
  slug: "my-new-article", // URL-friendly identifier
  reading_time: "5 min read", // Estimated reading time
  published_at: "2026-01-25", // Publication date (YYYY-MM-DD)
  summary: "A brief description of the article for listings.", // Short summary
  content: `# My New Article Title

Your markdown content here...

## Section 1

Content...
`, // Full article content in markdown
  img: "/images/articles/my-article.jpg", // Cover image path
  featured: false, // Show in featured section
  status: "published", // "published" or "draft"
}
```

3. Add article images to `public/images/articles/`
4. Run validation: `npm run validate:articles`
5. Build and test: `npm run build`

### Updating an Existing Article

1. Open `src/domains/article/model/mock.ts`
2. Find the article by `slug` or `id`
3. Modify the desired fields
4. Run validation: `npm run validate:articles`
5. Build and test: `npm run build`

### Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | number | Unique identifier |
| `title` | Yes | string | Article title |
| `url` | Yes | string | URL path (e.g., "/articles/slug") |
| `slug` | Yes | string | URL-friendly name (lowercase, hyphens) |
| `reading_time` | Yes | string | Estimated reading time (e.g., "5 min read") |
| `published_at` | Yes | string | Publication date (YYYY-MM-DD format) |
| `summary` | Yes | string | Brief description for article listings |
| `img` | Yes | string | Cover image path |
| `featured` | Yes | boolean | Show in featured section |
| `content` | No | string | Full article content in markdown |
| `status` | No | "published" \| "draft" | Article visibility (defaults to "published") |

### Draft & Scheduled Publishing

**Creating a Draft Article:**
Set `status: "draft"` to hide the article from public listings. The article will not appear until you change it to `"published"`.

```typescript
{
  // ... other fields
  status: "draft", // Article is hidden
}
```

**Scheduling an Article:**
Set `published_at` to a future date. The article will automatically become visible on that date.

```typescript
{
  // ... other fields
  published_at: "2026-02-01", // Will appear on Feb 1st
  status: "published",
}
```

**Publishing Workflow:**
1. Create article with `status: "draft"`
2. Review and edit content
3. When ready, change to `status: "published"`
4. Deploy to make it live

### Validation

Articles are validated using Zod schema. Common validation errors:

- **Missing required field**: All required fields must be present
- **Invalid date format**: `published_at` must be YYYY-MM-DD format
- **Invalid status**: `status` must be "published" or "draft"

Run `npm run validate:articles` to check for errors before deploying

## Images

### Project Images

Place project images in: `public/images/projects/`

Recommended specifications:
- Cover image: 1200x630px (social sharing compatible)
- Screenshots: 1920x1080px (full HD)
- Format: JPG or WebP for photos, PNG for graphics

### Image Paths

Use absolute paths from public folder:
```
/images/projects/my-project.jpg
```

### Article Images

Place article images in: `public/images/articles/`

Recommended specifications:
- Cover image: 1200x630px (social sharing compatible)
- Format: JPG or WebP for photos, PNG for graphics

## Deployment

After making content changes:

1. Run validation: `npm run validate:content` (validates both projects and articles)
2. Run tests: `npm test`
3. Build locally: `npm run build`
4. Commit changes to git
5. Push to trigger deployment

**Individual validation commands:**
- `npm run validate:projects` - Validate projects only
- `npm run validate:articles` - Validate articles only
- `npm run validate:content` - Validate all content

See Story 6.4 for one-command deploy workflow.
