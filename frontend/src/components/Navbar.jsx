import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            +
          </span>
          <span className="hidden sm:inline">AI Health Risk &amp; Wellness</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Dashboard
              </Link>
              <Link to="/history" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                History
              </Link>
              <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Products
              </Link>
              <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Profile
              </Link>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Products
              </Link>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Login
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
