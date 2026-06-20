import * as React from 'react';
export interface TagProps {
  className?: string;
  style?: React.CSSProperties;
  color?: "blue" | "rose" | "green" | "teal" | "orange";
  size?: "s";
  /** Text content; defaults to "React". */
  text1?: string;
}
export declare const Tag: React.FC<TagProps>;
export default Tag;
