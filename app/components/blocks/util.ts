/** Small presentational helpers shared by blocks (display labels + avatar initials). */
import type { Status, Category } from "./view-models";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const STATUS_LABEL: Record<Status, string> = {
  open: "Открыт",
  review: "На рассмотрении",
  "in-progress": "В работе",
  verification: "На проверке",
  completed: "Завершён",
  rejected: "Отклонён",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  marketing: "Маркетинг",
  design: "Дизайн",
  programming: "Программирование",
  development: "Разработка",
  coding: "Кодинг",
};
