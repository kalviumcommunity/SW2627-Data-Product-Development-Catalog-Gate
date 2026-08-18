import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../lib/api/client";
import { useAuth } from "../context/AuthContext";
import "../landing.css";

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await login(email, password);

      if (session.role !== "super_admin") {
        logout();
        throw new Error("This account is not authorized as a super admin.");
      }

      navigate("/admin");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="super-admin-login">
      <div className="super-admin-login-card">
        <div className="super-admin-login-logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 17V7" />
            <path d="M15 17V7" />
            <path d="M9 12h6" />
          </svg>
          CatalogGate
        </div>

        <div className="super-admin-login-header">
          <h1>Super Admin Login</h1>
          <p>Access the CatalogGate super admin console</p>
        </div>

        <form className="super-admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="super-admin-email">Work Email</label>
            <input
              type="email"
              id="super-admin-email"
              className="form-control"
              placeholder="superadmin@cataloggate.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="super-admin-password">Password</label>
            <input
              type="password"
              id="super-admin-password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="super-admin-login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="super-admin-login-footer">Secured by CatalogGate Enterprise Auth.</p>
      </div>
    </div>
  );
}
