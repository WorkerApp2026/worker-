export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function required(value) {
  return String(value || "").trim().length > 0;
}

export function minLength(value, min = 1) {
  return String(value || "").trim().length >= min;
}