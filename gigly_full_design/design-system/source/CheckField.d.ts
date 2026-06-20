import * as React from 'react';
export interface CheckFieldProps {
  className?: string;
  style?: React.CSSProperties;
  list1Txt?: string;
  list2?: boolean;
  list2Txt?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const CheckField: React.FC<CheckFieldProps>;
export default CheckField;
