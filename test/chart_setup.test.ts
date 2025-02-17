import { c2mChart } from "../src/entryPoint_mjs";
import { SUPPORTED_CHART_TYPES } from "../src/types";

window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

test("Confirm that C2M modifies provided elements", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement,
        cc: mockElementCC
    });

    expect(err).toBe(null);
    expect(mockElement.getAttribute("tabIndex")).toBe("0");
    expect(mockElementCC.getAttribute("aria-live")).toBe("assertive");
});

test("Confirm that C2M treats the container as the CC element if no CC element is provided", () => {
    const mockElement = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        element: mockElement
    });

    expect(err).toBe(null);
    expect(mockElement.getAttribute("tabIndex")).toBe("0");
    expect(mockElement.getAttribute("aria-live")).toBe("assertive");
});

test("C2M setup handles partial axis info", () => {
    const mockElement = document.createElement("div");
    const mockElementCC = document.createElement("div");
    const { err } = c2mChart({
        type: SUPPORTED_CHART_TYPES.LINE,
        data: [1, 2, 3, 4, 5],
        axes: {
            y: {
                minimum: 0
            }
        },
        element: mockElement,
        cc: mockElementCC
    });
    expect(err).toBe(null);

    mockElement.dispatchEvent(new Event("focus"));

    // Confirm that a summary was generated
    expect(mockElementCC.textContent).toContain(`y is "" from 0 to 5.`);

    // Confirm
    expect(mockElementCC.textContent).not.toContain(`Sonified live chart`);
    expect(mockElementCC.textContent).not.toContain(`Press M`);
});
