import { getFaceTransform } from "../cube-transforms";

describe("cube-transforms", () => {
  const size = 30;
  const half = size / 2;

  it("returns transform for front face", () => {
    expect(getFaceTransform("front", size)).toBe(`translateZ(${half}px)`);
  });

  it("returns transform for back face", () => {
    expect(getFaceTransform("back", size)).toBe(
      `rotateY(180deg) translateZ(${half}px)`
    );
  });

  it("returns transform for right face", () => {
    expect(getFaceTransform("right", size)).toBe(
      `rotateY(90deg) translateZ(${half}px)`
    );
  });

  it("returns transform for left face", () => {
    expect(getFaceTransform("left", size)).toBe(
      `rotateY(-90deg) translateZ(${half}px)`
    );
  });

  it("returns transform for top face", () => {
    expect(getFaceTransform("top", size)).toBe(
      `rotateX(90deg) translateZ(${half}px)`
    );
  });

  it("returns transform for bottom face", () => {
    expect(getFaceTransform("bottom", size)).toBe(
      `rotateX(-90deg) translateZ(${half}px)`
    );
  });

  it("returns safe fallback for unknown position", () => {
    expect(getFaceTransform("unknown", size)).toBe("translateZ(0px)");
  });
});
