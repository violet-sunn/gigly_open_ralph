import * as React from 'react';
export interface DropdownItemProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "hover" | "disabled";
  selected?: boolean;
  /** Text content; defaults to "Фильтр". */
  text1?: string;
}
export declare const DropdownItem: React.FC<DropdownItemProps>;
export default DropdownItem;
