import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import Assessment from "../pages/Assessment";
import { submitAssessment } from "../services/assessmentService";

vi.mock("../services/assessmentService", () => ({
  submitAssessment: vi.fn(),
}));

function renderAssessment() {
  return render(
    <MemoryRouter>
      <Assessment />
    </MemoryRouter>
  );
}

describe("Assessment page", () => {
  test("shows the 3-step progress indicator", () => {
    renderAssessment();
    expect(screen.getByText("Basic Info")).toBeInTheDocument();
    expect(screen.getByText("Symptoms")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  test("blocks submission with no symptoms and no free text, without calling the API", () => {
    renderAssessment();

    // Step 0 -> Step 1 -> Step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /get my assessment/i }));

    expect(
      screen.getByText(/please describe your symptoms or select at least one/i)
    ).toBeInTheDocument();
    expect(submitAssessment).not.toHaveBeenCalled();
  });

  test("allows navigating back to the first step", () => {
    renderAssessment();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
  });
});
