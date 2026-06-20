import * as React from 'react';
export interface StatusProps {
  className?: string;
  style?: React.CSSProperties;
  status?: "открыт" | "на рассмотрении" | "в работе" | "на проверке" | "завершён" | "отклонён";
  /** Text content; defaults to "Открыт". */
  text1?: string;
}
export declare const Status: React.FC<StatusProps>;
export default Status;
