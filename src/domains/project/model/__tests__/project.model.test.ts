import ProjectModel from "../index";
import mockData from "../mock";

jest.useFakeTimers();

describe("Project domain model (mock mode)", () => {
  it("fetchAll should return all mock projects", async () => {
    const promise = ProjectModel.fetchAll();

    // Avanzamos el timer simulado de 2s para resolver el delay de mocks
    jest.advanceTimersByTime(2000);

    const data = await promise;
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(mockData.length);
    expect(data[0].title).toBe(mockData[0].title);
  });
});
