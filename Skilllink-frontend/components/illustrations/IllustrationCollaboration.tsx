import React from 'react';

const IllustrationCollaboration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Desk */}
      <rect x="25" y="75" width="100" height="8" rx="2" fill="currentColor" stroke="none"/>
      <path d="M35 83 V 98" />
      <path d="M115 83 V 98" />
      {/* Monitor */}
      <rect x="50" y="30" width="50" height="35" rx="2" />
      <path d="M75 65 V 75" />
      <path d="M65 75 H 85" />
      {/* People in monitor */}
      <circle cx="65" cy="42" r="4" />
      <path d="M65 46 V 52" />
      <circle cx="85" cy="42" r="4" />
      <path d="M85 46 V 52" />
      {/* Person */}
      <circle cx="110" cy="40" r="10" />
      <path d="M110 50 V 65 C 110 70, 105 75, 100 75" />
    </g>
  </svg>
);

export default IllustrationCollaboration;