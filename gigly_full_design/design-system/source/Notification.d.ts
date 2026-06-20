import * as React from 'react';
export interface NotificationProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text1?: string;
  /** Text content; defaults to "09:41". */
  text2?: string;
  /** Text content; defaults to "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ". */
  text3?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Notification: React.FC<NotificationProps>;
export default Notification;
