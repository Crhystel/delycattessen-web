// True when `value` is something an <img> can render (URL, data URI, blob or
// server-relative path). Emojis and empty values are not images.
export function isImageSource(value) {
  return (
    typeof value === "string" &&
    (value.startsWith("data:") ||
      value.startsWith("http") ||
      value.startsWith("blob:") ||
      value.startsWith("/"))
  );
}
