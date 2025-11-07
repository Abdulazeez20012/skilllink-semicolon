import React from 'react';
import { getPartnerLogo } from '../images';
import PartnerCartesiIcon from './icons/PartnerCartesiIcon';
import PartnerOptimismIcon from './icons/PartnerOptimismIcon';
import PartnerLiskIcon from './icons/PartnerLiskIcon';
import PartnerAyaIcon from './icons/PartnerAyaIcon';
import PartnerWeb3LadiesIcon from './icons/PartnerWeb3LadiesIcon';
import PartnerQIcon from './icons/PartnerQIcon';
import PartnerBlockfuseIcon from './icons/PartnerBlockfuseIcon';
import PartnerBaseIcon from './icons/PartnerBaseIcon';

interface PartnerLogoProps {
  name: string;
  className?: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ name, className = "h-7 md:h-8 text-neutral-gray-light transition-transform duration-300 hover:scale-110" }) => {
  // Get the logo URL or 'svg' indicator
  const logoSource = getPartnerLogo(name.toLowerCase());
  
  // If it's an image URL, render an img tag
  if (logoSource !== 'svg' && logoSource.startsWith('http')) {
    return <img src={logoSource} alt={`${name} logo`} className={className} />;
  }
  
  // Otherwise, render the SVG icon
  switch (name.toLowerCase()) {
    case 'cartesi':
      return <PartnerCartesiIcon className={className} />;
    case 'optimism':
      return <PartnerOptimismIcon className={className} />;
    case 'lisk':
      return <PartnerLiskIcon className={className} />;
    case 'aya':
      return <PartnerAyaIcon className={className} />;
    case 'web3ladies':
      return <PartnerWeb3LadiesIcon className={className} />;
    case 'q':
      return <PartnerQIcon className={className} />;
    case 'blockfuse':
      return <PartnerBlockfuseIcon className={className} />;
    case 'base':
      return <PartnerBaseIcon className={className} />;
    default:
      return <div className={className}>Logo</div>;
  }
};

export default PartnerLogo;