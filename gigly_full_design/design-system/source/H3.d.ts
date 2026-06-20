import * as React from 'react';
export interface H3Props {
  className?: string;
  style?: React.CSSProperties;
  type?: "header 3" | "file";
  /** Text content; defaults to "ЗАДАЧА". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const H3: React.FC<H3Props>;
export default H3;
