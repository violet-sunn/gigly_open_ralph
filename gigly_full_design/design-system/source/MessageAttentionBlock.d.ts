import * as React from 'react';
export interface MessageAttentionBlockProps {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  /** Text content; defaults to "5". */
  text1?: string;
  /** Text content; defaults to "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ". */
  text2?: string;
  /** Text content; defaults to "Кристина". */
  text3?: string;
}
export declare const MessageAttentionBlock: React.FC<MessageAttentionBlockProps>;
export default MessageAttentionBlock;
