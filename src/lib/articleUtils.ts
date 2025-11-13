export function formatDate(dateString?: string): string {
  if (!dateString) return "Chưa có ngày";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  if (!content) return "0 phút đọc";
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} phút đọc`;
}
