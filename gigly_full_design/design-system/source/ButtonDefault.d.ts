import * as React from 'react';
export interface ButtonDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "hover" | "active";
  type?: "default" | "icon" | "icon end";
  /** Text content; defaults to "ОТПРАВИТЬ ОТКЛИК". */
  text1?: string;
}
export declare const ButtonDefault: React.FC<ButtonDefaultProps>;
export default ButtonDefault;
