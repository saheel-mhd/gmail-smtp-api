export type Strength = { label: string; score: number; color: string };

export function passwordStrength(pw: string): Strength {
  if (!pw) return { label: "—", score: 0, color: "#94a3b8" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const tiers: Strength[] = [
    { label: "Too short", score: 0, color: "#b3261e" },
    { label: "Weak", score: 1, color: "#d97706" },
    { label: "Fair", score: 2, color: "#d97706" },
    { label: "Good", score: 3, color: "#0ea5e9" },
    { label: "Strong", score: 4, color: "#14b882" },
    { label: "Excellent", score: 5, color: "#057a55" }
  ];
  const tier = tiers[Math.min(score, tiers.length - 1)];
  return { ...tier, score };
}
