import * as React from 'react';
export interface InputFieldProps {
  className?: string;
  style?: React.CSSProperties;
  iconL?: boolean;
  iconLType?: React.ReactNode;
  state?: "default";
  iconR?: boolean;
  iconRType?: React.ReactNode;
  text?: string;
}
export declare const InputField: React.FC<InputFieldProps>;
export default InputField;
