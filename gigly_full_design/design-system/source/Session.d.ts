import * as React from 'react';
export interface SessionProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "active" | "delete";
  /** Text content; defaults to "Категория уведомлений". */
  text1?: string;
  /** Text content; defaults to "Описание ". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Session: React.FC<SessionProps>;
export default Session;
