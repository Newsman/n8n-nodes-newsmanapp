export function parseJson(value: unknown, fieldName: string): any {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value;

  const trimmed = String(value)?.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new Error(
      `Invalid JSON for '${fieldName}'. ${(error as Error).message}`,
    );
  }
}

/** Accepts "a@x.com, b@y.com", JSON array string, or string[]. */
export function parseEmailList(value: unknown, fieldName: string): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }

  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    throw new Error(`${fieldName} is required (one or more email addresses)`);
  }

  if (trimmed.startsWith('[')) {
    const parsed = parseJson(trimmed, fieldName);
    if (!Array.isArray(parsed) || parsed.length < 1) {
      throw new Error(`${fieldName} must be a non-empty email array`);
    }
    return parsed.map((v) => String(v).trim()).filter(Boolean);
  }

  return trimmed
    .split(/[,;\s]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}
