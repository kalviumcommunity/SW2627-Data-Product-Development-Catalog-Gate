export function decodeJwtPayload(token) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getRoleFromAccessToken(accessToken) {
  const payload = decodeJwtPayload(accessToken);
  return payload?.user_role ?? null;
}

export function getRedirectForRole(role) {
  switch (role) {
    case "vendor":
      return "/vendor";
    case "catalog_admin":
    case "super_admin":
      return "/admin";
    default:
      return "/";
  }
}
