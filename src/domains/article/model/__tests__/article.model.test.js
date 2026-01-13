import ArticleModel from "../index";
import mockData from "../mock";

jest.useFakeTimers();

describe("Article domain model (mock mode)", () => {
  it("fetchAll should return all mock articles", async () => {
    const promise = ArticleModel.fetchAll();

    // Avanzamos el timer simulado de 2s para resolver el delay de mocks
    jest.advanceTimersByTime(2000);

    const data = await promise;
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(mockData.length);
    expect(data[0].title).toBe(mockData[0].title);
  });

  it("fetchById should return the article with the given id when it exists", async () => {
    const target = mockData[1];
    const promise = ArticleModel.fetchById(target.id);
    jest.advanceTimersByTime(2000);

    const article = await promise;
    expect(article.id).toBe(target.id);
    expect(article.title).toBe(target.title);
  });

  it("fetchById should fall back to the first article when id is not found", async () => {
    const promise = ArticleModel.fetchById(9999);
    jest.advanceTimersByTime(2000);

    const article = await promise;
    expect(article.id).toBe(mockData[0].id);
  });
});
