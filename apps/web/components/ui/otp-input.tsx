"use client";

import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  ariaLabel?: string;
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  hasError = false,
  ariaLabel = "Verification code"
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Pad the value into an array of single chars (or empty string).
  const digits = useMemo(() => {
    const arr = Array.from({ length }, (_, i) => value[i] ?? "");
    return arr;
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  // Whenever value reaches full length, fire onComplete.
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  function setDigitAt(index: number, digit: string) {
    const sanitized = digit.replace(/\D/g, "").slice(0, 1);
    const next = digits.slice();
    next[index] = sanitized;
    const joined = next.join("").slice(0, length);
    onChange(joined);
  }

  function handleChange(index: number, raw: string) {
    if (raw.length > 1) {
      // User typed/pasted multiple chars — distribute starting at this box.
      const sanitized = raw.replace(/\D/g, "").slice(0, length - index);
      const next = digits.slice();
      for (let i = 0; i < sanitized.length; i++) {
        next[index + i] = sanitized[i];
      }
      onChange(next.join("").slice(0, length));
      const focusIndex = Math.min(index + sanitized.length, length - 1);
      refs.current[focusIndex]?.focus();
      return;
    }
    setDigitAt(index, raw);
    if (raw && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (digits[index]) {
        // Clear current digit
        setDigitAt(index, "");
      } else if (index > 0) {
        // Empty: hop back and clear that one
        const prev = index - 1;
        setDigitAt(prev, "");
        refs.current[prev]?.focus();
      }
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
      event.preventDefault();
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
      event.preventDefault();
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (!pasted) return;
    event.preventDefault();
    const sanitized = pasted.replace(/\D/g, "").slice(0, length - index);
    const next = digits.slice();
    for (let i = 0; i < sanitized.length; i++) {
      next[index + i] = sanitized[i];
    }
    onChange(next.join("").slice(0, length));
    const focusIndex = Math.min(index + sanitized.length, length - 1);
    refs.current[focusIndex]?.focus();
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => {
            setActiveIndex(i);
            // Select existing digit so typing replaces it
            e.currentTarget.select();
          }}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          style={{
            flex: "1 1 0",
            width: 0,
            minWidth: 0,
            maxWidth: 56,
            height: 56,
            textAlign: "center",
            fontFamily: "var(--font-mono, ui-monospace), monospace",
            fontSize: 24,
            fontWeight: 600,
            padding: 0,
            border: hasError
              ? "1px solid rgba(179, 38, 30, 0.55)"
              : activeIndex === i
                ? "1px solid rgba(10, 127, 81, 0.55)"
                : "1px solid var(--line)",
            borderRadius: 12,
            background: "#fff",
            color: "var(--ink)",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            boxShadow: hasError
              ? "0 0 0 4px rgba(239, 68, 68, 0.14)"
              : activeIndex === i
                ? "0 0 0 4px rgba(20, 184, 130, 0.14)"
                : "none"
          }}
        />
      ))}
    </div>
  );
}
