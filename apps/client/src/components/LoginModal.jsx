import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../lib/api/client";
import { getRedirectForRole } from "../lib/auth/jwt";
import { useAuth } from "../context/AuthContext";

const ROLE_CONFIG = {
  vendor: {
    subtitle: "Access your vendor listing workspace",
    emailPlaceholder: "vendor@company.com",
    expectedRole: "vendor",
  },
  client: {
    subtitle: "Access your catalog admin console",
    emailPlaceholder: "admin@cataloggate.com",
    expectedRole: "catalog_admin",
  },
};

export default function LoginModal({ isOpen, initialRole = "vendor", onClose }) {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [activeRole, setActiveRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveRole(initialRole);
      setError("");
    }
  }, [isOpen, initialRole]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await login(email, password);
      const config = ROLE_CONFIG[activeRole];

      if (config.expectedRole && session.role !== config.expectedRole) {
        logout();
        throw new Error(`This account is not authorized as a ${activeRole === "vendor" ? "vendor" : "catalog admin"}.`);
      }

      const redirect = getRedirectForRole(session.role);
      if (redirect && redirect !== "/") {
        navigate(redirect);
      }

      onClose();
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

  const config = ROLE_CONFIG[activeRole];

  return (
    <div
      className={`modal-overlay${isOpen ? " active" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="modal-container">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <h3>CatalogGate Portal</h3>
          <p>{config.subtitle}</p>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab${activeRole === "vendor" ? " active" : ""}`}
            onClick={() => setActiveRole("vendor")}
          >
            Vendor
          </button>
          <button
            type="button"
            className={`modal-tab${activeRole === "client" ? " active" : ""}`}
            onClick={() => setActiveRole("client")}
          >
            Catalog Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-input">Work Email</label>
            <input
              type="email"
              id="email-input"
              className="form-control"
              placeholder={config.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
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

          <button type="submit" className="modal-btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="modal-footer">Secured by CatalogGate Enterprise Auth.</div>
      </div>
    </div>
  );
}
