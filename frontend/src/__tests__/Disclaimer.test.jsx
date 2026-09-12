import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Disclaimer from "../components/Disclaimer";

describe("Disclaimer", () => {
  test("always shows the required medical safety disclaimer text", () => {
    render(<Disclaimer />);
    expect(
      screen.getByText(/does not provide medical diagnosis or treatment/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/consult a qualified healthcare professional/i)
    ).toBeInTheDocument();
  });

  test("renders in compact mode without losing the core message", () => {
    render(<Disclaimer compact />);
    expect(
      screen.getByText(/educational and informational purposes only/i)
    ).toBeInTheDocument();
  });
});
