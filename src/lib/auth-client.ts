export type StoredAuthUser = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
};

const KEY = "chillphim.auth.user";

export function getStoredAuthUser(): StoredAuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: StoredAuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearStoredAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

