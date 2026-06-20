import * as React from 'react';
export interface RoleplayProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  state?: "default" | "hover";
  /** Text content; defaults to "Специалист". */
  text1?: string;
}
export declare const Roleplay: React.FC<RoleplayProps>;
export default Roleplay;
