import * as React from 'react';
export interface MassageProps {
  className?: string;
  style?: React.CSSProperties;
  shorten?: boolean;
  state?: "default" | "hover";
  /** Text content; defaults to "Поддержка". */
  text1?: string;
  /** Text content; defaults to "Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться.". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Massage: React.FC<MassageProps>;
export default Massage;
