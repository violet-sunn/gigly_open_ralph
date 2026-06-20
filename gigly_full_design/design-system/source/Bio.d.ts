import * as React from 'react';
export interface BioProps {
  className?: string;
  style?: React.CSSProperties;
  prop?: boolean;
  verificationMark?: boolean;
  sizeFor?: "gig" | "acc bio";
  profile?: boolean;
  stars?: string;
  info?: boolean;
  uSER?: "company" | "specialist";
  text?: string;
  text2?: boolean;
}
export declare const Bio: React.FC<BioProps>;
export default Bio;
