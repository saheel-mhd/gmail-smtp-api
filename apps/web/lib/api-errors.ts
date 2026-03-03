type ParsedError = {
  message: string;
  status?: number;
  isAuth: boolean;
  raw?: string;
};

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function parseApiError(err: unknown): ParsedError {
  let status: number | undefined;
  let raw = "";

  if (typeof err === "string") {
    raw = err;
  } else if (err && typeof err === "object") {
    const maybeStatus = (err as { status?: unknown; statusCode?: unknown }).status;
    status = toNumber(maybeStatus) ?? toNumber((err as { statusCode?: unknown }).statusCode);
    if ("message" in err && typeof (err as { message?: unknown }).message === "string") {
      raw = (err as { message: string }).message;
    }
  }

  let message = raw;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        message?: string;
        error?: string;
        statusCode?: number;
        status?: number;
      };
      if (parsed && typeof parsed === "object") {
        if (!status) {
          status = toNumber(parsed.statusCode) ?? toNumber(parsed.status);
        }
        if (typeof parsed.message === "string") {
          message = parsed.message;
        } else if (typeof parsed.error === "string") {
          message = parsed.error;
        }
      }
    } catch {
      // keep raw message
    }
  }

  const normalized = message.trim();
  const lowered = normalized.toLowerCase();
  const isAuth =
    status === 401 ||
    lowered.includes("invalid session") ||
    lowered.includes("unauthorized");

  const authBase = normalized || "Invalid session";
  const friendlyMessage = isAuth
    ? `${authBase.charAt(0).toUpperCase()}${authBase.slice(1)}. Please sign in again.`
    : normalized || (status ? `Request failed (HTTP ${status})` : "Request failed");

  return {
    message: friendlyMessage,
    status,
    isAuth,
    raw: raw || undefined
  };
}
