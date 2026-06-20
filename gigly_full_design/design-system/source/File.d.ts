import * as React from 'react';
export interface FileProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  /** Text content; defaults to "ТЗ.doc". */
  text1?: string;
  /** Text content; defaults to "15 MB". */
  text2?: string;
}
export declare const File: React.FC<FileProps>;
export default File;
