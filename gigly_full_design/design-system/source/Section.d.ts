import * as React from 'react';
export interface SectionProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "content" | "variant2";
  /** Text content; defaults to "Мои заказы". */
  text1?: string;
  /** Text content; defaults to "Добавить". */
  text2?: string;
  /** Text content; defaults to "«Создание веб-страницы с использованием HTML и CSS»". */
  text3?: string;
  /** Text content; defaults to "150 000₽". */
  text4?: string;
}
export declare const Section: React.FC<SectionProps>;
export default Section;
