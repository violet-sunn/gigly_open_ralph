import * as React from 'react';
export interface HH1BLOCKProps {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  icon?: boolean;
  iconType?: React.ReactNode;
  /** Text content; defaults to "Активные проекты". */
  text1?: string;
  /** Text content; defaults to "5". */
  text2?: string;
}
export declare const HH1BLOCK: React.FC<HH1BLOCKProps>;
export default HH1BLOCK;
