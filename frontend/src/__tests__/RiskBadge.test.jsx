import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import RiskBadge from "../components/RiskBadge";

describe("RiskBadge", () => {
  test("renders the correct label for each risk level", () => {
    render(<RiskBadge level="LOW" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  test("renders 'Urgent Attention' for URGENT level", () => {
    render(<RiskBadge level="URGENT" />);
    expect(screen.getByText("Urgent Attention")).toBeInTheDocument();
  });

  test("falls back gracefully for unknown levels", () => {
    render(<RiskBadge level="SOMETHING_UNEXPECTED" />);
    expect(screen.getByText("SOMETHING_UNEXPECTED")).toBeInTheDocument();
  });
});
