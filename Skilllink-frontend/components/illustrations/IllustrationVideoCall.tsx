import React from 'react';

const IllustrationVideoCall: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Screen */}
      <rect x="15" y="15" width="120" height="70" rx="4" />
      
      {/* Grid lines */}
      <path d="M15 40 H 135" />
      <path d="M15 65 H 135" />
      <path d="M55 15 V 85" />
      <path d="M95 15 V 85" />
      
      {/* People icons */}
      <g opacity="0.7">
        <circle cx="35" cy="28" r="5" />
        <path d="M30 36 C 35 42, 40 42, 45 36" />
        
        <circle cx="75" cy="28" r="5" />
        <path d="M70 36 C 75 42, 80 42, 85 36" />
        
        <circle cx="115" cy="28" r="5" />
        <path d="M110 36 C 115 42, 120 42, 125 36" />
        
        <circle cx="35" cy="53" r="5" />
        <path d="M30 61 C 35 67, 40 67, 45 61" />
        
        <circle cx="75" cy="53" r="5" />
        <path d="M70 61 C 75 67, 80 67, 85 61" />
        
        <circle cx="115" cy="53" r="5" />
        <path d="M110 61 C 115 67, 120 67, 125 61" />
      </g>
    </g>
  </svg>
);

export default IllustrationVideoCall;