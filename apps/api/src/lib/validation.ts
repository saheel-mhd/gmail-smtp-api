const BLOCKED_HEADERS = new Set([
  "to",
  "from",
  "cc",
  "bcc",
  "subject",
  "content-type",
  "mime-version"
]);

export function assertSafeHeaders(headers: Record<string, string>): void {
  for (const [rawKey, rawValue] of Object.entries(headers)) {
    const key = rawKey.trim().toLowerCase();
    if (BLOCKED_HEADERS.has(key)) {
      throw new Error(`header '${rawKey}' is not allowed`);
    }
    if (/[\r\n]/.test(rawKey) || /[\r\n]/.test(rawValue)) {
      throw new Error("header injection detected");
    }
  }
}
