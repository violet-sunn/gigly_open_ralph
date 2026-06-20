import * as React from 'react';
export interface HEADERProps {
  className?: string;
  style?: React.CSSProperties;
  search?: boolean;
  type?: "header 1" | "header 2" | "type3";
  button?: boolean;
  collapsed?: boolean;
  switcher?: boolean;
  counter?: boolean;
  /** Text content; defaults to "ДАШБОРД". */
  text1?: string;
  /** Text content; defaults to "6". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const HEADER: React.FC<HEADERProps>;
export default HEADER;
