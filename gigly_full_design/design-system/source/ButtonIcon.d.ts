import * as React from 'react';
export interface ButtonIconProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  state?: "default" | "hover" | "active";
  bG?: boolean;
  counter?: boolean;
  /** Text content; defaults to "5". */
  text1?: string;
}
export declare const ButtonIcon: React.FC<ButtonIconProps>;
export default ButtonIcon;
