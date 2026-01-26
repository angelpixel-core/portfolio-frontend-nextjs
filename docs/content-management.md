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

> Coming in Story 6.2: Article Publishing

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

## Deployment

After making content changes:

1. Run validation: `npm run validate:projects`
2. Run tests: `npm test`
3. Build locally: `npm run build`
4. Commit changes to git
5. Push to trigger deployment

See Story 6.4 for one-command deploy workflow.
