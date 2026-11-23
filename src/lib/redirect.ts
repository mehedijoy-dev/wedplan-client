// ?redirect=/services/123 thakle sekhane, na hole /dashboard (jeta role onujayi redirect kore)
export function getRedirectTarget() {
  if (typeof window === "undefined") return "/dashboard";
  const r = new URLSearchParams(window.location.search).get("redirect");
  return r && r.startsWith("/") && !r.startsWith("//") ? r : "/dashboard";
}
