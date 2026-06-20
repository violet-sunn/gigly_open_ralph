import * as React from 'react';
export interface AttentionCardProps {
  className?: string;
  style?: React.CSSProperties;
  property?: "смена статуса" | "новое сообщение" | "приближается дедлайн" | "заявка принята" | "заявка отклонена" | "получена оплата" | "нет ответа" | "нет заявок" | "ждёт проверки";
  uSER?: "specialist" | "company";
  /** Text content; defaults to "👀". */
  text1?: string;
  /** Text content; defaults to "Новый статус". */
  text2?: string;
  /** Text content; defaults to "1 нед.". */
  text3?: string;
  /** Text content; defaults to "Остался 1 день". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const AttentionCard: React.FC<AttentionCardProps>;
export default AttentionCard;
