import * as React from 'react';
export interface GigFull4Props {
  className?: string;
  style?: React.CSSProperties;
  category?: boolean;
  timeline?: boolean;
  loadline?: string;
  tag2?: React.ReactNode;
  tag?: React.ReactNode;
  tag3?: React.ReactNode;
  description?: boolean;
  prop?: boolean;
  loadline2?: string;
  loadline3?: string;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text1?: string;
  /** Text content; defaults to "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.". */
  text2?: string;
  /** Text content; defaults to "25.08.2025". */
  text3?: string;
  /** Text content; defaults to "25.08.2025". */
  text4?: string;
}
export declare const GigFull4: React.FC<GigFull4Props>;
export default GigFull4;
