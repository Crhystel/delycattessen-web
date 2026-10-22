// Builds a query string ("?a=1&b=2", or "" when there is nothing to send) from
// a params object, skipping empty values. `institutionParam` is the value
// from useInstitution(): null means "use the user's own institution" and is
// left out, "all" or an id becomes `institution=...`.
export function buildQuery(params = {}, institutionParam = null) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  if (institutionParam) search.set("institution", institutionParam);
  const query = search.toString();
  return query ? `?${query}` : "";
}
