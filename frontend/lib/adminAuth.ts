export const saveToken = (token: string, expiresInHrs: number = 24) => {
  const expiresAt = new Date().getTime() + expiresInHrs * 60 * 60 * 1000;
  localStorage.setItem("webring_admin_token", token);
  localStorage.setItem("webring_admin_expires", expiresAt.toString());
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const expiresAt = localStorage.getItem("webring_admin_expires");
  if (!expiresAt || new Date().getTime() > parseInt(expiresAt)) {
    logout();
    return null;
  }
  return localStorage.getItem("webring_admin_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("webring_admin_token");
    localStorage.removeItem("webring_admin_expires");
  }
};

export const getTimeRemaining = (): string => {
  const expiresAt = localStorage.getItem("webring_admin_expires");
  if (!expiresAt) return "Expired";
  const ms = parseInt(expiresAt) - new Date().getTime();
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};
