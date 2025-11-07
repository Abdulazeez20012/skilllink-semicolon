
import React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const LogoIcon: React.FC<LogoIconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    {...props}
  >
    {/* Outer Circle */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" />

    {/* Semicolon Dot */}
    <circle cx="50" cy="32" r="10" fill="currentColor" />

    {/* Semicolon Comma */}
    <path 
      d="M60 62 A 10 10 0 1 1 40 62 Q 40 76 44 72 L 60 62 Z"
      fill="currentColor"
    />
  </svg>
);

export default LogoIcon;
