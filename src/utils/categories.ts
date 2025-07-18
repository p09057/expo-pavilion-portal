import type { PavilionCategory } from '../types';

export const CATEGORY_LABELS: Record<PavilionCategory, string> = {
  foreign: '海外パビリオン',
  signature: 'シグネチャーパビリオン',
  corporate: '企業パビリオン',
  japan: '日本パビリオン',
  theme: 'テーマ館',
  other: 'その他',
};

export const CATEGORY_COLORS: Record<PavilionCategory, string> = {
  foreign: 'bg-blue-100 text-blue-800',
  signature: 'bg-purple-100 text-purple-800',
  corporate: 'bg-green-100 text-green-800',
  japan: 'bg-red-100 text-red-800',
  theme: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};