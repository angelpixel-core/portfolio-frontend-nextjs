export type FacePosition =
  | "front"
  | "back"
  | "top"
  | "bottom"
  | "left"
  | "right";

export type FaceValue = string | number;

export type CubeOrientation = Record<FacePosition, FaceValue>;

export type CubeFaceConfig = Partial<Record<FacePosition, FaceValue>>;

export type CubeAction =
  | "rotateUp"
  | "rotateDown"
  | "rotateLeft"
  | "rotateRight"
  | "rotateHalfY";

export const initialOrientation: CubeOrientation = {
  front: "A",
  back: "P",
  top: "I",
  bottom: "X",
  left: "E",
  right: "L",
};

export const rotateUp = (cube: CubeOrientation): CubeOrientation => ({
  front: cube.top,
  bottom: cube.front,
  back: cube.bottom,
  top: cube.back,
  left: cube.left,
  right: cube.right,
});

export const rotateDown = (cube: CubeOrientation): CubeOrientation => ({
  front: cube.bottom,
  top: cube.front,
  back: cube.top,
  bottom: cube.back,
  left: cube.left,
  right: cube.right,
});

export const rotateLeft = (cube: CubeOrientation): CubeOrientation => ({
  front: cube.right,
  left: cube.front,
  back: cube.left,
  right: cube.back,
  top: cube.top,
  bottom: cube.bottom,
});

export const rotateRight = (cube: CubeOrientation): CubeOrientation => ({
  front: cube.left,
  right: cube.front,
  back: cube.right,
  left: cube.back,
  top: cube.top,
  bottom: cube.bottom,
});

export const rotateHalfY = (cube: CubeOrientation): CubeOrientation => ({
  front: cube.back,
  back: cube.front,
  top: cube.top,
  bottom: cube.bottom,
  left: cube.right,
  right: cube.left,
});

export const applyCubeAction = (
  cube: CubeOrientation,
  action: CubeAction
): CubeOrientation => {
  switch (action) {
    case "rotateUp":
      return rotateUp(cube);
    case "rotateDown":
      return rotateDown(cube);
    case "rotateLeft":
      return rotateLeft(cube);
    case "rotateRight":
      return rotateRight(cube);
    case "rotateHalfY":
      return rotateHalfY(cube);
    default:
      return cube;
  }
};
