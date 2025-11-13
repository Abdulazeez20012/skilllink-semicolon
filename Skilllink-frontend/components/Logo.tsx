import React from 'react';
import { getLogo } from '../images';
import LogoIcon from './icons/LogoIcon';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  // Get the logo URL or 'svg' indicator
  const logoSource = getLogo();
  
  // If it's an image URL, render an img tag
  if (logoSource !== 'svg' && logoSource.startsWith('http')) {
    return <img src={logoSource} alt="SkillLink Logo" className={className} style={{ width: size, height: size }} />;
  }
  
  // Otherwise, render the SVG logo
  return <LogoIcon size={size} className={className} />;
};

export default Logo;