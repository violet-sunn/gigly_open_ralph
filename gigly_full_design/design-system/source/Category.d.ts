import * as React from 'react';
export interface CategoryProps {
  className?: string;
  style?: React.CSSProperties;
  color?: "blue" | "rose" | "green" | "teal" | "orange";
  size?: "s";
  /** Text content; defaults to "Маркетинг". */
  text1?: string;
}
export declare const Category: React.FC<CategoryProps>;
export default Category;
