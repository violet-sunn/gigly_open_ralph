import * as React from 'react';
export interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "s" | "xs";
  /** Text content; defaults to "[Senior Frontend Engineer]". */
  text1?: string;
}
export declare const Component: React.FC<ComponentProps>;
export default Component;
