"use client";

import Link from "next/link";
import Image from "next/image";
import { useArticles } from "@/hooks";
import ArticleListSkeleton from "./ArticleListSkeleton";

export default function ArticlesPage() {
  const { data: articles = [], isLoading, isError } = useArticles();

  if (isLoading) {
    return <ArticleListSkeleton />;
  }

  if (isError || !articles.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-xl">No articles available.</p>
      </div>
    );
  }

  return (
    <div className="articles-grid">
      <ul className="articles-list flex flex-col gap-8">
        {articles.map((article, index) => {
          const isExternal = article.url?.startsWith("http");
          const label = `Read article: ${article.title}`;

          return (
            <li key={article.id} className="article-item">
              <Link
                href={article.url}
                className="group"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={label}
              >
                <article className="grid grid-cols-12 gap-4 items-center p-4 border border-solid border-dark dark:border-light rounded-lg transition-all hover:shadow-lg">
                  {article.img && (
                    <div className="col-span-4 md:col-span-12 relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={article.img}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                  )}
                  <div className="col-span-8 md:col-span-12 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold group-hover:text-primary dark:group-hover:text-primaryDark transition-colors">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-dark/75 dark:text-light/75">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-dark/60 dark:text-light/60">
                      {article.reading_time && (
                        <span>{article.reading_time}</span>
                      )}
                      {article.published_at && (
                        <time dateTime={article.published_at}>
                          {new Date(article.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
