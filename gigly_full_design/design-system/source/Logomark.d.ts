import * as React from 'react';
export interface LogomarkProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "l" | "s" | "m" | "xs";
}
export declare const Logomark: React.FC<LogomarkProps>;
export default Logomark;
