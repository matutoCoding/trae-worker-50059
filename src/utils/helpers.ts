export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function calculateDaysRemaining(releaseDate: string): number {
  const today = new Date();
  const release = new Date(releaseDate);
  const diff = release.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getScoreLevel(score: number): string {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 60) return '合格';
  return '不合格';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
