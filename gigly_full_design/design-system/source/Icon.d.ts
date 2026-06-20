import * as React from 'react';
export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "bootstrap";
  property2?: "outline & logos" | "filled";
  property3?: "star" | "star-half";
}
export declare const Icon: React.FC<IconProps>;
export default Icon;
