import { SiteHeader } from "@/components/site-header";
import {
  Hero,
  Stats,
  HowItWorks,
  Audiences,
  FAQ,
  Trust,
  CTA,
  Footer,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Stats />
        <Audiences />
        <FAQ />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </>
  );
}