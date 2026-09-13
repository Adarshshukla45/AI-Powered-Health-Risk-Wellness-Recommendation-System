import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Profile</h1>
      <Card>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</dt>
            <dd className="mt-1 text-slate-800">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt>
            <dd className="mt-1 text-slate-800">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Age</dt>
            <dd className="mt-1 text-slate-800">{user.age || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gender</dt>
            <dd className="mt-1 capitalize text-slate-800">{user.gender?.replace(/_/g, " ") || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Member Since</dt>
            <dd className="mt-1 text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </Card>
      <p className="mt-4 text-xs text-slate-400">
        This project deliberately does not store medical history or diagnosis
        information on your profile — only the minimal identity fields above.
        Your assessment history is stored separately.
      </p>
    </div>
  );
}
