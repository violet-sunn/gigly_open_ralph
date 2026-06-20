import * as React from 'react';
export interface MessageProps {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  view?: "dashboard" | "chat";
  /** Text content; defaults to "5". */
  text1?: string;
  /** Text content; defaults to "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ". */
  text2?: string;
  /** Text content; defaults to "Кристина". */
  text3?: string;
  /** Text content; defaults to "2 мин". */
  text4?: string;
}
export declare const Message: React.FC<MessageProps>;
export default Message;
