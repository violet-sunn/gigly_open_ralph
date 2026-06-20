import * as React from 'react';
export interface GigProps {
  className?: string;
  style?: React.CSSProperties;
  timeline?: boolean;
  postingDate?: boolean;
  tags?: boolean;
  description?: boolean;
  status?: "открыт" | "на рассмотрении" | "в работе" | "на проверке" | "звершен" | "отклонен";
  bottomInfo?: boolean;
  loadline3?: string;
  /** Text content; defaults to "2 мин". */
  text1?: string;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text2?: string;
  /** Text content; defaults to "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.". */
  text3?: string;
  /** Text content; defaults to "25.08.2025". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
}
export declare const Gig: React.FC<GigProps>;
export default Gig;
