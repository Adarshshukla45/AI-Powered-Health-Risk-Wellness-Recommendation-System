import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import Login from "../pages/Login";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login page", () => {
  test("renders email and password fields", () => {
    useAuth.mockReturnValue({ login: vi.fn() });
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("calls login with entered credentials on submit", async () => {
    const login = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({ email: "user@example.com", password: "password123" })
    );
  });

  test("shows an error message when login fails", async () => {
    const login = vi.fn().mockRejectedValue({ message: "Invalid email or password." });
    useAuth.mockReturnValue({ login });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
  });
});
