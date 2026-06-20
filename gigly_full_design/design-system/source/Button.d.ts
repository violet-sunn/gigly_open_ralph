import * as React from 'react';
export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: boolean;
  property?: "primary" | "secondary" | "tetriary";
  iconType?: React.ReactNode;
  state?: "default" | "hover" | "disabled";
  txt?: boolean;
  text?: string;
}
export declare const Button: React.FC<ButtonProps>;
export default Button;
