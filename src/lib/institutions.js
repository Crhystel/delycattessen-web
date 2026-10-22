// Special value representing the consolidated view across all institutions.
export const ALL_INSTITUTIONS = "all";

// Builds the `?institution=` query string every institution-scoped endpoint
// accepts. Returns "" when the backend should use the user's own institution.
export function institutionQuery(institutionParam) {
  return institutionParam ? `?institution=${institutionParam}` : "";
}
