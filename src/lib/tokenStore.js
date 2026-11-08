// Single owner of the persisted session (JWT pair + cached profile).
// Everything that touches localStorage for auth goes through here so the
// storage keys live in one place and apiClient can read the token itself.
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const PROFILE_KEY = "user_profile";
// Epoch ms of the last user interaction; shared between tabs for idle logout.
const ACTIVITY_KEY = "last_activity";

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode / quota): the session is memory-only.
  }
}

export const tokenStore = {
  getAccess: () => read(ACCESS_KEY),
  getRefresh: () => read(REFRESH_KEY),
  setTokens({ access, refresh }) {
    write(ACCESS_KEY, access);
    write(REFRESH_KEY, refresh);
  },
  getProfile() {
    try {
      const saved = read(PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },
  setProfile: (profile) =>
    write(PROFILE_KEY, profile ? JSON.stringify(profile) : null),
  getLastActivity() {
    const saved = Number(read(ACTIVITY_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : null;
  },
  touchActivity: (now = Date.now()) => write(ACTIVITY_KEY, String(now)),
  clear() {
    write(ACCESS_KEY, null);
    write(REFRESH_KEY, null);
    write(PROFILE_KEY, null);
    write(ACTIVITY_KEY, null);
  },
};
