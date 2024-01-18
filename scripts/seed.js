const fs = require("fs");
const path = require("path");
const { db } = require("@vercel/postgres");

const readJsonData = async (filename) => {
  const jsonFilePath = path.join(__dirname, `private/${filename}.json`);
  const jsonData = await fs.promises.readFile(jsonFilePath, "utf-8");

  return JSON.parse(jsonData);
};

async function seedArticles(client) {
  try {
    // Create the "articles" table if it doesn't exist
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        summary VARCHAR(255),
        time VARCHAR(255),
        date VARCHAR(255),
        link VARCHAR(255),
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'private', 'draft'))
      );
    `;
    console.log(`Created "articles" table`);

    // Insert data into the "articles" table
    const articles = await readJsonData("articles");
    const insertedArticles = await Promise.all(
      articles.map(
        (article) => client.sql`
          INSERT INTO articles (
            name,
            title,
            summary,
            time,
            date,
            link,
            featured,
            status
          )
          VALUES (
            ${article.name},
            ${article.title},
            ${article.summary},
            ${article.time},
            ${article.date},
            ${article.link},
            ${article.featured},
            ${article.status}
          )
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );
    console.log(`Seeded ${insertedArticles.length} articles`);

    return {
      createTable,
      articles: insertedArticles,
    };
  } catch (error) {
    console.error("Error seeding articles:", error);
    throw error;
  }
}

async function seedProjects(client) {
  try {
    // Create the "projects" table if it doesn't exist
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        summary VARCHAR(255),
        demo VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL UNIQUE,
        repository VARCHAR(255) NOT NULL,
        tags text ARRAY,
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'private', 'draft'))
      );
    `;
    console.log(`Created "projects" table`);

    // Insert data into the "projects" table
    const projects = await readJsonData("projects");
    const insertedProjects = await Promise.all(
      projects.map(
        (project) => client.sql`
          INSERT INTO projects (
            title,
            summary,
            demo,
            name,
            repository,
            tags,
            featured,
            status
          )
          VALUES (
            ${project.title},
            ${project.summary},
            ${project.demo},
            ${project.name},
            ${project.repository},
            ${project.tags},
            ${project.featured},
            ${project.status}
          )
          ON CONFLICT (id) DO NOTHING;
        `,
      ),
    );
    console.log(`Seeded ${insertedProjects.length} projects`);

    return {
      createTable,
      projects: insertedProjects,
    };
  } catch (error) {
    console.error("Error seeding projects:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedArticles(client);
  // await seedProjects(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
