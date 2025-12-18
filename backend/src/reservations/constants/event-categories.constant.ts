export const EVENT_CATEGORIES = {
  REVIEW: 'review',
  OFFLINE: 'off',
} as const;

export type EventCategory =
  (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES];

export const CATEGORY_TO_PLATFORM_MAP = {
  [EVENT_CATEGORIES.OFFLINE]: 'web',
  [EVENT_CATEGORIES.REVIEW]: 'ios',
} as const;
