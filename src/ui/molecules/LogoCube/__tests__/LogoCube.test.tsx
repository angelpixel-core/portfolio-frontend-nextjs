import {
  act,
  createEvent,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import LogoCube from "../index";

const mockUseReducedMotion = jest.fn(() => false);

jest.mock("@/hooks/ui/useReducedMotion", () => ({
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
  default: () => mockUseReducedMotion(),
}));

describe("LogoCube", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("rotates on hover and syncs orientation after transition end", async () => {
    const { container } = render(
      <LogoCube
        faces={{
          front: "F",
          back: "B",
          top: "T",
          bottom: "D",
          left: "L",
          right: "R",
        }}
      />
    );

    const cube = container.querySelector(".logo-cube") as HTMLSpanElement;
    const body = container.querySelector(".logo-cube__body") as HTMLSpanElement;
    const frontFace = () =>
      (container.querySelectorAll(".logo-cube__face")[0] as HTMLSpanElement)
        .textContent;

    expect(cube.classList.contains("logo-cube--inverted")).toBe(false);
    expect(frontFace()).toBe("F");

    fireEvent.mouseEnter(cube);
    expect(body.classList.contains("logo-cube__body--animating")).toBe(true);
    expect(frontFace()).toBe("F");

    const transitionEvent = createEvent.transitionEnd(body);
    Object.defineProperty(transitionEvent, "propertyName", {
      value: "transform",
    });
    fireEvent(body, transitionEvent);

    await waitFor(() => {
      expect(frontFace()).toBe("B");
    });
    expect(cube.classList.contains("logo-cube--inverted")).toBe(true);
  });

  it("keeps APIXEL order without transition animation when reduced motion is enabled", () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { container } = render(<LogoCube />);

    const cube = container.querySelector(".logo-cube") as HTMLSpanElement;
    const body = container.querySelector(".logo-cube__body") as HTMLSpanElement;
    const frontFace = () =>
      (container.querySelectorAll(".logo-cube__face")[0] as HTMLSpanElement)
        .textContent;

    const observed: Array<string | null> = [frontFace()];

    expect(body.classList.contains("logo-cube__body--animating")).toBe(false);
    expect(frontFace()).toBe("A");
    expect(cube.classList.contains("logo-cube--inverted")).toBe(false);

    fireEvent.mouseEnter(cube);
    observed.push(frontFace());

    expect(body.classList.contains("logo-cube__body--animating")).toBe(false);
    expect(frontFace()).toBe("P");
    expect(cube.classList.contains("logo-cube--inverted")).toBe(true);

    fireEvent.mouseLeave(cube);
    fireEvent.mouseEnter(cube);
    observed.push(frontFace());

    expect(frontFace()).toBe("I");
    expect(cube.classList.contains("logo-cube--inverted")).toBe(false);

    fireEvent.mouseLeave(cube);
    fireEvent.mouseEnter(cube);
    observed.push(frontFace());

    fireEvent.mouseLeave(cube);
    fireEvent.mouseEnter(cube);
    observed.push(frontFace());

    fireEvent.mouseLeave(cube);
    fireEvent.mouseEnter(cube);
    observed.push(frontFace());

    fireEvent.mouseLeave(cube);
    fireEvent.mouseEnter(cube);
    observed.push(frontFace());

    expect(observed).toEqual(["A", "P", "I", "X", "E", "L", "A"]);
  });

  it("keeps exact visible A->P->I->X->E->L->A order and restarts", async () => {
    const { container } = render(<LogoCube />);

    const body = container.querySelector(".logo-cube__body") as HTMLSpanElement;
    const frontFace = () =>
      (container.querySelectorAll(".logo-cube__face")[0] as HTMLSpanElement)
        .textContent;

    const completeIdleStep = async () => {
      act(() => {
        jest.advanceTimersByTime(2500);
      });

      expect(body.classList.contains("logo-cube__body--animating")).toBe(true);

      const transitionEvent = createEvent.transitionEnd(body);
      Object.defineProperty(transitionEvent, "propertyName", {
        value: "transform",
      });

      fireEvent(body, transitionEvent);

      act(() => {
        jest.advanceTimersByTime(16);
      });

      await waitFor(() => {
        expect(body.classList.contains("logo-cube__body--animating")).toBe(
          false
        );
      });
    };

    const observed: Array<string | null> = [frontFace()];

    await completeIdleStep();
    observed.push(frontFace());

    await completeIdleStep();
    observed.push(frontFace());

    await completeIdleStep();
    observed.push(frontFace());

    await completeIdleStep();
    observed.push(frontFace());

    await completeIdleStep();
    observed.push(frontFace());

    await completeIdleStep();
    observed.push(frontFace());

    await completeIdleStep();
    observed.push(frontFace());

    expect(observed).toEqual(["A", "P", "I", "X", "E", "L", "A", "P"]);
  });

  it("falls back to complete default faces with partial configuration", () => {
    const { container } = render(<LogoCube faces={{ front: "A" }} />);

    const faceValues = Array.from(
      container.querySelectorAll(".logo-cube__face"),
      (element) => element.textContent
    );

    expect(faceValues).toEqual(["A", "P", "I", "X", "E", "L"]);
  });

  it("starts idle rotation after 2.5 seconds", () => {
    const { container } = render(<LogoCube />);

    const body = container.querySelector(".logo-cube__body") as HTMLSpanElement;

    expect(body.classList.contains("logo-cube__body--animating")).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2499);
    });

    expect(body.classList.contains("logo-cube__body--animating")).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(body.classList.contains("logo-cube__body--animating")).toBe(true);
  });
});
