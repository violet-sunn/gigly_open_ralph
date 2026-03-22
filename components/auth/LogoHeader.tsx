import React from 'react';

export interface LogoHeaderProps {
  logoSrc?: string;
  logoAlt?: string;
}

/**
 * LogoHeader component - semi-transparent header with logo
 * Matches Figma design specs: node 4106:615
 * Background: rgba(49,54,67,0.5), Border-radius: 10px, Padding: 7px/9px
 *
 * @param logoSrc - URL of the logo image
 * @param logoAlt - Alt text for the logo image
 */
export function LogoHeader({ logoSrc, logoAlt = 'Logo' }: LogoHeaderProps) {
  return (
    <div
      className="
        inline-flex items-center justify-center
        px-[9px] py-[7px]
        rounded-[10px]
        bg-[rgba(49,54,67,0.5)]
        overflow-hidden
      "
    >
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-[29px] w-auto"
        />
      ) : (
        <div className="h-[29px] px-4 flex items-center justify-center">
          <span className="text-white text-xl font-semibold">GIGLY</span>
        </div>
      )}
    </div>
  );
}
