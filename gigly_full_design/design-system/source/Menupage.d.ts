import * as React from 'react';
export interface MenupageProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  shorten?: boolean;
  page?: string;
  state?: "default" | "hover" | "active";
  icon?: boolean;
  counter?: boolean;
  /** Text content; defaults to "6". */
  text1?: string;
}
export declare const Menupage: React.FC<MenupageProps>;
export default Menupage;
