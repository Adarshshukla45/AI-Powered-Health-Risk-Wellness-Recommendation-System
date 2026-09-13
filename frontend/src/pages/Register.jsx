import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", gender: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register({
        ...form,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-8">
      <Card title="Create your account" subtitle="Takes less than a minute" className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="name"
            label="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            id="email"
            type="email"
            label="Email address"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            required
            hint="At least 8 characters."
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="age"
              type="number"
              label="Age (optional)"
              min={0}
              max={120}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <div>
              <label htmlFor="gender" className="label-text">
                Gender (optional)
              </label>
              <select
                id="gender"
                className="input-field"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {error && <ErrorMessage message={error} />}
          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
