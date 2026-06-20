import * as React from 'react';
export interface MenuProps {
  className?: string;
  style?: React.CSSProperties;
  shorten?: boolean;
  activeTab?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}
export declare const Menu: React.FC<MenuProps>;
export default Menu;
