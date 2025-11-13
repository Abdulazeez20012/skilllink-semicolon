import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/Logo';
import { ROUTES } from '../constants';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import PartnerLogo from '../components/PartnerLogo';
import FeatureIllustration from '../components/FeatureIllustration';
import { USER_AVATARS } from '../images';

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string, id?: string, style?: React.CSSProperties }> = ({ children, className, id, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });
  return <div ref={ref} id={id} style={style} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>{children}</div>;
};

const PartnerLogos = () => (
  <>
    <PartnerLogo name="cartesi" />
    <PartnerLogo name="optimism" />
    <PartnerLogo name="lisk" />
    <PartnerLogo name="aya" />
    <PartnerLogo name="web3ladies" />
    <PartnerLogo name="q" />
    <PartnerLogo name="blockfuse" />
    <PartnerLogo name="base" />
  </>
);

const LandingPage: React.FC = () => {
    const features = [
      { illustration: <FeatureIllustration name="student-desk" />, title: "Seamless Assignments", description: "Facilitators post assignments and resources with ease. Students view, submit, and track their progress." },
      { illustration: <FeatureIllustration name="collaboration" />, title: "Real-time Discussions", description: "Engage in threaded discussions on every assignment, fostering collaboration and instant feedback." },
      { illustration: <FeatureIllustration name="video-call" />, title: "Role-Based Dashboards", description: "Custom-tailored interfaces for students and facilitators provide the right tools at the right time." }
    ];

  return (
    <div className="bg-secondary dark:bg-neutral-gray-dark text-neutral-soft-black dark:text-white min-h-screen font-sans">
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex justify-between items-center p-2 bg-white/60 dark:bg-neutral-gray-dark/60 backdrop-blur-lg rounded-full border border-neutral-light-gray/50 dark:border-neutral-gray-medium/50 shadow-sm">
            <Link to="/" className="flex items-center">
              <Logo className="text-primary" size={32} />
              <span className="ml-2 text-xl font-bold font-heading hidden sm:block">SkillLink</span>
            </Link>
            <nav className="flex items-center space-x-4 pr-2">
               <a href="#about" className="font-medium text-neutral-soft-black dark:text-secondary hover:text-primary dark:hover:text-red-400 transition-colors px-2">About</a>
              <Link to={ROUTES.LOGIN}><Button variant="secondary" size="md">Login</Button></Link>
            </nav>
          </div>
      </header>

      <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
        {/* Animated Arcs & Attached Images */}
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Center Glow */}
            <div className="absolute bg-primary/5 dark:bg-primary/10 rounded-full w-[250px] h-[250px] animate-pulse"></div>

            {/* Arc 1 (Outer) */}
            <div className="absolute border-2 border-dashed border-primary/10 rounded-full animate-spin-slow" style={{ width: '700px', height: '700px', animationDuration: '60s' }}>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 group">
                <img src={USER_AVATARS.COMMUNITY_MEMBER_1} alt="Community member" className="w-20 h-20 rounded-full shadow-lg border-2 border-primary animate-spin-reverse-slow object-cover" style={{ animationDuration: '60s' }}/>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-neutral-soft-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Facilitator</span>
              </div>
            </div>
            
            {/* Arc 2 (Middle) */}
            <div className="absolute border-2 border-dashed border-primary/10 rounded-full animate-spin-slow" style={{ width: '500px', height: '500px', animationDirection: 'reverse', animationDuration: '50s' }}>
               <div className="absolute top-[15%] right-0 -translate-y-1/2 translate-x-1/2 group">
                  <img src={USER_AVATARS.COMMUNITY_MEMBER_2} alt="Community member" className="w-16 h-16 rounded-full shadow-lg border-2 border-primary animate-spin-reverse-slow object-cover" style={{ animationDirection: 'reverse', animationDuration: '50s' }}/>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-neutral-soft-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Student</span>
               </div>
            </div>
            
            {/* Arc 3 (Inner) */}
            <div className="absolute border-2 border-dashed border-primary/10 rounded-full animate-spin-slow" style={{ width: '300px', height: '300px', animationDuration: '40s' }}>
               <div className="absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2 group">
                  <img src={USER_AVATARS.COMMUNITY_MEMBER_3} alt="Community member" className="w-14 h-14 rounded-full shadow-lg border-2 border-primary animate-spin-reverse-slow object-cover" style={{ animationDuration: '40s' }}/>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 text-xs text-white bg-neutral-soft-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Student</span>
               </div>
            </div>
        </div>

        <div className="relative z-10 text-center flex-grow flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-4 max-w-4xl opacity-0 animate-fade-in-zoom [animation-delay:200ms] [animation-fill-mode:forwards]">
            Organize, Collaborate,<br/> and Grow with <span className="text-primary">SkillLink</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-gray-light max-w-3xl mx-auto mb-10 opacity-0 animate-slide-up [animation-delay:400ms] [animation-fill-mode:forwards]">
            Kickstart your learning journey with structured assignments, shared resources, and real-time feedback all in one interactive platform built for students and facilitators.
          </p>
          <div className="opacity-0 animate-slide-up [animation-delay:600ms] [animation-fill-mode:forwards]">
            <Link to={ROUTES.SIGNUP}>
              <Button 
                variant="primary" 
                size="lg" 
                rightIcon={<ArrowRightIcon className="w-5 h-5"/>}
                className="animate-pulse-on-load [animation-delay:1s] [animation-iteration-count:2]"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative z-10 w-full mt-16 animate-fade-in [animation-delay:800ms] [animation-fill-mode:forwards]">
           <div className="relative w-full overflow-hidden mask-gradient">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary dark:from-neutral-gray-dark z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary dark:from-neutral-gray-dark z-10"></div>
              <div className="flex animate-marquee-scroll">
                  <div className="flex-shrink-0 flex items-center justify-around space-x-16 px-8">
                      <PartnerLogos />
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-around space-x-16 px-8" aria-hidden="true">
                      <PartnerLogos />
                  </div>
              </div>
            </div>
        </div>
      </main>

      <section id="about" className="py-24 bg-secondary dark:bg-neutral-soft-black bg-radial-stain-light dark:bg-radial-stain-dark bg-no-repeat bg-center">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Designed for a Global Standard</h2>
              <p className="text-lg text-neutral-gray-light">Every feature is crafted to provide a seamless, intuitive, and powerful learning experience.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <AnimatedSection key={index} style={{ transitionDelay: `${index * 200}ms` }}>
                <div className="text-center p-4">
                  {feature.illustration}
                  <h3 className="text-2xl font-bold font-heading mt-6 mb-2">{feature.title}</h3>
                  <p className="text-neutral-gray-light">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-neutral-light-gray dark:bg-neutral-soft-black border-t border-neutral-light-gray dark:border-neutral-gray-medium">
        <div className="container mx-auto px-6 text-center text-neutral-gray-light">
          <p>&copy; {new Date().getFullYear()} SkillLink by Semicolon. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;