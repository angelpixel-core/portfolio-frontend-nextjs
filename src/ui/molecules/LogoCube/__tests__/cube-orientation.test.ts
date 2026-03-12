import {
  applyCubeAction,
  initialOrientation,
  rotateDown,
  rotateHalfY,
  rotateLeft,
  rotateRight,
  rotateUp,
} from "../cube-orientation";

describe("cube-orientation", () => {
  it("keeps all six unique faces after each rotation", () => {
    const rotations = [
      rotateUp(initialOrientation),
      rotateDown(initialOrientation),
      rotateLeft(initialOrientation),
      rotateRight(initialOrientation),
      rotateHalfY(initialOrientation),
    ];

    rotations.forEach((cube) => {
      const values = Object.values(cube);
      expect(new Set(values)).toEqual(new Set(["A", "P", "I", "X", "E", "L"]));
    });
  });

  it("rotates up correctly", () => {
    expect(rotateUp(initialOrientation)).toEqual({
      front: "I",
      back: "X",
      top: "P",
      bottom: "A",
      left: "E",
      right: "L",
    });
  });

  it("rotates down correctly", () => {
    expect(rotateDown(initialOrientation)).toEqual({
      front: "X",
      back: "I",
      top: "A",
      bottom: "P",
      left: "E",
      right: "L",
    });
  });

  it("rotates left correctly", () => {
    expect(rotateLeft(initialOrientation)).toEqual({
      front: "L",
      back: "E",
      top: "I",
      bottom: "X",
      left: "A",
      right: "P",
    });
  });

  it("rotates right correctly", () => {
    expect(rotateRight(initialOrientation)).toEqual({
      front: "E",
      back: "L",
      top: "I",
      bottom: "X",
      left: "P",
      right: "A",
    });
  });

  it("rotates half turn on Y axis correctly", () => {
    expect(rotateHalfY(initialOrientation)).toEqual({
      front: "P",
      back: "A",
      top: "I",
      bottom: "X",
      left: "L",
      right: "E",
    });
  });

  it("dispatches actions through applyCubeAction", () => {
    expect(applyCubeAction(initialOrientation, "rotateUp")).toEqual(
      rotateUp(initialOrientation)
    );
    expect(applyCubeAction(initialOrientation, "rotateDown")).toEqual(
      rotateDown(initialOrientation)
    );
    expect(applyCubeAction(initialOrientation, "rotateLeft")).toEqual(
      rotateLeft(initialOrientation)
    );
    expect(applyCubeAction(initialOrientation, "rotateRight")).toEqual(
      rotateRight(initialOrientation)
    );
    expect(applyCubeAction(initialOrientation, "rotateHalfY")).toEqual(
      rotateHalfY(initialOrientation)
    );
  });

  it("preserves string and symbol face values through rotations", () => {
    const branded = {
      front: "A",
      back: "Σ",
      top: "Z",
      bottom: "Y",
      left: "M",
      right: "K",
    } as const;

    const up = rotateUp(branded);
    expect(up.front).toBe("Z");
    expect(up.bottom).toBe("A");

    const down = rotateDown(branded);
    expect(down.front).toBe("Y");
    expect(down.top).toBe("A");

    const left = rotateLeft(branded);
    expect(left.front).toBe("K");
    expect(left.left).toBe("A");

    const right = rotateRight(branded);
    expect(right.front).toBe("M");
    expect(right.right).toBe("A");

    const values = Object.values(applyCubeAction(branded, "rotateLeft"));
    expect(new Set(values)).toEqual(new Set(["A", "Σ", "Z", "Y", "M", "K"]));
  });
});
