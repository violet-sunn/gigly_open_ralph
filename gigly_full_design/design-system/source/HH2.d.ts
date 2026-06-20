import * as React from 'react';
export interface HH2Props {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  icon?: boolean;
  iconType?: React.ReactNode;
  /** Text content; defaults to "Задача". */
  text1?: string;
}
export declare const HH2: React.FC<HH2Props>;
export default HH2;
