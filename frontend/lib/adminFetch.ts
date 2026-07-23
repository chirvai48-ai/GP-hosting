// Wrapper around fetch for admin API calls.
// Always sends the session cookie cross-origin; if the session is gone
// (401), sends the user to the login page with an "expired" notice.
export async function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const res = await fetch(input, { ...init, credentials: "include" });

  if (res.status === 401 && typeof window !== "undefined") {
    const alreadyOnLogin = window.location.pathname.startsWith("/admin/login");
    if (!alreadyOnLogin) {
      window.location.replace("/admin/login?reason=expired");
    }
  }

  return res;
}
