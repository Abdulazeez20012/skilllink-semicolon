// Image configuration file - Easy to replace placeholder images with real ones
// To replace images, simply update the URLs in this file

/*
HOW TO REPLACE PLACEHOLDER IMAGES:

1. For user avatars:
   - Update the specific user avatar URLs in USER_AVATARS object
   - Or replace the DEFAULT_GENERATOR with your own avatar service

2. For cohort images:
   - Update the specific cohort image URLs in COHORT_IMAGES object
   - Or replace the DEFAULT_GENERATOR with your own image service

3. For partner logos:
   - Update the specific partner logo URLs in PARTNER_LOGOS object
   - Replace SVG icons with image URLs for easier management

4. For feature illustrations:
   - Update the specific illustration URLs in FEATURE_ILLUSTRATIONS object
   - Replace SVG illustrations with image URLs for easier management

5. For the main logo:
   - Update the LOGO_URL to use a real image instead of the SVG logo

6. The system will automatically use your images without changing any other code

Example:
USER_AVATARS.ADA_LOVELACE = 'https://your-server.com/images/ada-lovelace.jpg'
COHORT_IMAGES.JAVA = 'https://your-server.com/images/java-cohort-cover.jpg'
PARTNER_LOGOS.CARTESI = 'https://your-server.com/images/cartesi-logo.png'
FEATURE_ILLUSTRATIONS.STUDENT_DESK = 'https://your-server.com/images/student-desk.jpg'
LOGO_URL = 'https://your-server.com/images/logo.png'
*/

// User avatars
export const USER_AVATARS = {
  // Default avatar generator - can be replaced with actual avatar URLs
  DEFAULT_GENERATOR: (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
  
  // Specific user avatars - replace with actual image URLs
  ADA_LOVELACE: 'https://picsum.photos/seed/ada/200',
  CHARLES_BABBAGE: 'https://picsum.photos/seed/charles/200',
  GRACE_HOPPER: 'https://picsum.photos/seed/grace/200',
  ALAN_TURING: 'https://picsum.photos/seed/turing/200',
  MARGARET_HAMILTON: 'https://picsum.photos/seed/hamilton/200',
  TIM_BERNERS_LEE: 'https://picsum.photos/seed/tim/200',
  
  // Community members on landing page
  COMMUNITY_MEMBER_1: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762530339/Generated_Image_November_07_2025_-_4_44PM_1_lglqgi.png',
  COMMUNITY_MEMBER_2: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762529812/semicolon_bptdfy.png',
  COMMUNITY_MEMBER_3: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762529812/semicolon_bptdfy.png',
};

// Cohort images
export const COHORT_IMAGES = {
  // Cohort cover images - replace with actual image URLs
  JAVA: 'https://picsum.photos/seed/java/600/400',
  PYTHON: 'https://picsum.photos/seed/python/600/400',
  FRONTEND: 'https://picsum.photos/seed/frontend/600/400',
  
  // Default cohort image generator
  DEFAULT_GENERATOR: (cohortId: string) => `https://picsum.photos/seed/${encodeURIComponent(cohortId)}/600/400`,
};

// Partner logos - replace SVG icons with actual image URLs for easier management
export const PARTNER_LOGOS = {
  // Default to SVG icons, but can be replaced with image URLs
  CARTESI: 'svg', // Replace with 'https://your-server.com/images/cartesi.png'
  OPTIMISM: 'svg', // Replace with 'https://your-server.com/images/optimism.png'
  LISK: 'svg', // Replace with 'https://your-server.com/images/lisk.png'
  AYA: 'svg', // Replace with 'https://your-server.com/images/aya.png'
  WEB3_LADIES: 'svg', // Replace with 'https://your-server.com/images/web3ladies.png'
  Q: 'svg', // Replace with 'https://your-server.com/images/q.png'
  BLOCKFUSE: 'svg', // Replace with 'https://your-server.com/images/blockfuse.png'
  BASE: 'svg', // Replace with 'https://your-server.com/images/base.png'
  
  // Default generator for partner logos
  DEFAULT_GENERATOR: (partnerName: string) => `svg`, // Replace with actual image URL generator
};

// Feature illustrations - replace SVG illustrations with actual image URLs for easier management
export const FEATURE_ILLUSTRATIONS = {
  // Default to SVG illustrations, but can be replaced with image URLs
  STUDENT_DESK: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762527862/man_sitting_down_ubbfdq.png', // Replace with 'https://your-server.com/images/student-desk.png'
  COLLABORATION: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762527862/man_facing_laptop_uoohfs.png', // Replace with 'https://your-server.com/images/collaboration.png'
  VIDEO_CALL: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762529587/woman_tz7zsv.png', // Replace with 'https://your-server.com/images/video-call.png'
  
  // Default generator for feature illustrations
  DEFAULT_GENERATOR: (illustrationName: string) => `svg`, // Replace with actual image URL generator
};

// Main logo - replace with actual image URL for easier management
export const LOGO = {
  // Default to SVG logo, but can be replaced with image URL
  URL: 'https://res.cloudinary.com/dipqudndh/image/upload/v1762529812/semicolon_bptdfy.png', // Replace with 'https://your-server.com/images/logo.png'
  
  // Default generator for logo
  DEFAULT_GENERATOR: () => `svg`, // Replace with actual image URL generator
};

// Utility function to get user avatar - uses default generator if no specific avatar is defined
export const getUserAvatar = (userId: string, userName: string): string => {
  // You can add specific avatar mappings here
  switch (userId) {
    case 'facilitator-01':
      return USER_AVATARS.ADA_LOVELACE;
    case 'student-01':
      return USER_AVATARS.CHARLES_BABBAGE;
    case 'student-02':
      return USER_AVATARS.GRACE_HOPPER;
    case 'student-03':
      return USER_AVATARS.ALAN_TURING;
    case 'student-04':
      return USER_AVATARS.MARGARET_HAMILTON;
    case 'fac-02':
      return USER_AVATARS.TIM_BERNERS_LEE;
    default:
      return USER_AVATARS.DEFAULT_GENERATOR(userName);
  }
};

// Utility function to get cohort image - uses default generator if no specific image is defined
export const getCohortImage = (cohortId: string): string => {
  // You can add specific cohort image mappings here
  switch (cohortId) {
    case 'cohort-java-2024':
      return COHORT_IMAGES.JAVA;
    case 'cohort-python-2024':
      return COHORT_IMAGES.PYTHON;
    case 'cohort-frontend-2024':
      return COHORT_IMAGES.FRONTEND;
    default:
      return COHORT_IMAGES.DEFAULT_GENERATOR(cohortId);
  }
};

// Utility function to get partner logo - returns 'svg' for default SVG icons or image URL
export const getPartnerLogo = (partnerName: string): string => {
  // You can add specific partner logo mappings here
  switch (partnerName) {
    case 'cartesi':
      return PARTNER_LOGOS.CARTESI;
    case 'optimism':
      return PARTNER_LOGOS.OPTIMISM;
    case 'lisk':
      return PARTNER_LOGOS.LISK;
    case 'aya':
      return PARTNER_LOGOS.AYA;
    case 'web3ladies':
      return PARTNER_LOGOS.WEB3_LADIES;
    case 'q':
      return PARTNER_LOGOS.Q;
    case 'blockfuse':
      return PARTNER_LOGOS.BLOCKFUSE;
    case 'base':
      return PARTNER_LOGOS.BASE;
    default:
      return PARTNER_LOGOS.DEFAULT_GENERATOR(partnerName);
  }
};

// Utility function to get feature illustration - returns 'svg' for default SVG illustrations or image URL
export const getFeatureIllustration = (illustrationName: string): string => {
  // You can add specific feature illustration mappings here
  switch (illustrationName) {
    case 'student-desk':
      return FEATURE_ILLUSTRATIONS.STUDENT_DESK;
    case 'collaboration':
      return FEATURE_ILLUSTRATIONS.COLLABORATION;
    case 'video-call':
      return FEATURE_ILLUSTRATIONS.VIDEO_CALL;
    default:
      return FEATURE_ILLUSTRATIONS.DEFAULT_GENERATOR(illustrationName);
  }
};

// Utility function to get logo - returns 'svg' for default SVG logo or image URL
export const getLogo = (): string => {
  // You can add specific logo mappings here
  return LOGO.URL !== 'svg' ? LOGO.URL : LOGO.DEFAULT_GENERATOR();
};