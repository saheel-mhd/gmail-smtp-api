const tokenRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

type TemplateRenderResult = {
  value: string;
  missing: string[];
};

export function renderTemplate(
  template: string,
  variables: Record<string, string | number | boolean>
): TemplateRenderResult {
  const missing = new Set<string>();
  const value = template.replace(tokenRegex, (_match, key: string) => {
    if (!(key in variables)) {
      missing.add(key);
      return "";
    }
    const raw = variables[key];
    return raw === null || raw === undefined ? "" : String(raw);
  });
  return { value, missing: Array.from(missing) };
}

export function extractTemplateKeys(template: string): string[] {
  const keys = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(template)) !== null) {
    keys.add(match[1]);
  }
  return Array.from(keys);
}

/**
 * Extract every unique {{var}} token across multiple template parts (subject, html, text).
 * Returns them sorted alphabetically for stable UI rendering. Uses matchAll to avoid the
 * stateful lastIndex pitfall of a shared global regex.
 */
export function extractTemplateVariables(parts: Array<string | null | undefined>): string[] {
  const re = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  const keys = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const match of part.matchAll(re)) {
      keys.add(match[1]);
    }
  }
  return Array.from(keys).sort();
}
