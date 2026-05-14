export function sanitizeFileName(fileName) {
  return String(fileName || "image")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();
}

export function buildFilePath(taskId, fileName) {
  const safeName = sanitizeFileName(fileName);
  const timestamp = Date.now();
  return `tasks/${taskId}/${timestamp}-${safeName}`;
}