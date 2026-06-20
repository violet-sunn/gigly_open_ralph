import * as React from 'react';
export interface ProfileFrameProps {
  className?: string;
  style?: React.CSSProperties;
  view?: "full" | "short";
  state?: "default" | "hover" | "focus" | "active";
  /** Text content; defaults to "Тимур Камальтдинов". */
  text1?: string;
  /** Text content; defaults to "Специалист". */
  text2?: string;
}
export declare const ProfileFrame: React.FC<ProfileFrameProps>;
export default ProfileFrame;
