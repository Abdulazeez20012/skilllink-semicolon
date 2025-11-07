import React from 'react';

const IllustrationStudentDesk: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Desk */}
      <rect x="20" y="70" width="110" height="8" rx="2" fill="currentColor" stroke="none" />
      <path d="M30 78 V 95" />
      <path d="M120 78 V 95" />
      {/* Laptop */}
      <path d="M55 55 H 95 V 70 H 55 Z" />
      <path d="M52 70 H 98" />
      {/* Person */}
      <circle cx="75" cy="35" r="10" />
      <path d="M75 45 V 60 C 75 65, 70 70, 65 70" />
      <path d="M85 55 C 95 55, 95 65, 85 65" />
      {/* Chair */}
      <path d="M100 95 C 100 80, 50 80, 50 95" />
      <path d="M75 95 V 60" />
    </g>
  </svg>
);

export default IllustrationStudentDesk;