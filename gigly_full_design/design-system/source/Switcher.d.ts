import * as React from 'react';
export interface SwitcherProps {
  className?: string;
  style?: React.CSSProperties;
  activeTab?: "l" | "r";
}
export declare const Switcher: React.FC<SwitcherProps>;
export default Switcher;
