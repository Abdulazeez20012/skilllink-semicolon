import React from 'react';
import { getFeatureIllustration } from '../images';
import IllustrationStudentDesk from './illustrations/IllustrationStudentDesk';
import IllustrationCollaboration from './illustrations/IllustrationCollaboration';
import IllustrationVideoCall from './illustrations/IllustrationVideoCall';

interface FeatureIllustrationProps {
  name: string;
  className?: string;
}

const FeatureIllustration: React.FC<FeatureIllustrationProps> = ({ name, className = "h-48 mx-auto mb-4" }) => {
  // Get the illustration URL or 'svg' indicator
  const illustrationSource = getFeatureIllustration(name.toLowerCase());
  
  // If it's an image URL, render an img tag
  if (illustrationSource !== 'svg' && illustrationSource.startsWith('http')) {
    return <img src={illustrationSource} alt={`${name} illustration`} className={className} />;
  }
  
  // Otherwise, render the SVG illustration
  switch (name.toLowerCase()) {
    case 'student-desk':
      return <IllustrationStudentDesk className={className} />;
    case 'collaboration':
      return <IllustrationCollaboration className={className} />;
    case 'video-call':
      return <IllustrationVideoCall className={className} />;
    default:
      return <div className={className}>Illustration</div>;
  }
};

export default FeatureIllustration;