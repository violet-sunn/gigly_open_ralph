import * as React from 'react';
export interface FilterProps {
  className?: string;
  style?: React.CSSProperties;
  iconLType?: React.ReactNode;
  state?: "default" | "hover" | "disabled";
  text?: boolean;
  iconRType?: React.ReactNode;
  expand?: boolean;
  iconR?: boolean;
  iconL?: boolean;
  selected?: boolean;
  /** Text content; defaults to "Фильтр". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const Filter: React.FC<FilterProps>;
export default Filter;
