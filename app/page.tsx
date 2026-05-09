import { EldritchNav } from '@/components/eldritch/nav';
import { EldritchHero } from '@/components/eldritch/hero';
import { SponsorStrip } from '@/components/eldritch/sponsor-strip';
import { ProblemSection } from '@/components/eldritch/problem-section';
import { HowItWorks } from '@/components/eldritch/how-it-works';
import { StackSection } from '@/components/eldritch/stack-section';
import { PatientsSection } from '@/components/eldritch/patients-section';
import { FinalCta } from '@/components/eldritch/final-cta';
import { EldritchFooter } from '@/components/eldritch/footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="nascent-bg" aria-hidden />
      <div className="sigil-field" aria-hidden />

      <EldritchNav />
      <EldritchHero />
      <SponsorStrip />
      <ProblemSection />
      <HowItWorks />
      <StackSection />
      <PatientsSection />
      <FinalCta />
      <EldritchFooter />
    </div>
  );
}
