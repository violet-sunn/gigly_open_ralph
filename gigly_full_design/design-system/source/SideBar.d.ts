import * as React from 'react';
export interface SideBarProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "full" | "short";
  noti?: boolean;
}
export declare const SideBar: React.FC<SideBarProps>;
export default SideBar;
