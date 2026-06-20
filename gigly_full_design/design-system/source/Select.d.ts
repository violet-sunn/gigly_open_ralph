import * as React from 'react';
export interface SelectProps {
  className?: string;
  style?: React.CSSProperties;
  label?: boolean;
  state?: "default" | "chosen";
  labelTxt?: string;
  /** Text content; defaults to "Русский". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Select: React.FC<SelectProps>;
export default Select;
