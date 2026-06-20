import * as React from 'react';
export interface SwitchBarProps {
  className?: string;
  style?: React.CSSProperties;
  tabText?: string;
  state?: "default" | "hover";
  counter?: boolean;
  active?: boolean;
  count?: string;
}
export declare const SwitchBar: React.FC<SwitchBarProps>;
export default SwitchBar;
