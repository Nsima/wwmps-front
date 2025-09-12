// src/lib/utils.ts
export const normalize = (s: string) =>
  s?.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ?? "";

export function makeSessionId() {
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function isGreeting(s: string) {
  return /^(hi|hello|hey|shalom|good (morning|afternoon|evening))\b/i.test(s.trim());
}

export function instantGreeting(name: string) {
  return `Hello! I’m ${name}. May God’s peace rest on you today. How can I pray with you or guide you?`;
}
