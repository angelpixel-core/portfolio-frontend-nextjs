"use client";

import { useArticles } from "@/hooks";

export default function ArticlesPage() {
  const { data: articles = [], isLoading, isError } = useArticles();

  if (isLoading) {
    return (
      <div className="articles-content">
        <h1>Articles</h1>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (isError || !articles.length) {
    return (
      <div className="articles-content">
        <h1>Articles</h1>
        <p>No articles available.</p>
      </div>
    );
  }

  return (
    <div className="articles-content">
      <h1>Articles</h1>
      <div className="articles-list">
        {articles.map((article, index) => (
          <article key={index} className="article-item">
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            {article.reading_time && (
              <span className="reading-time">{article.reading_time} min read</span>
            )}
            {article.published_at && (
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString()}
              </time>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
