"use client";

export function LogoutButton() {
  function handleLogout() {
    try {
      localStorage.removeItem("tutordesk_key");
    } catch {
      // ignore storage errors
    }
    window.location.assign("/dashboard");
  }

  return (
    <button type="button" onClick={handleLogout} className="btn alt btn-sm">
      Switch account
    </button>
  );
}
