"use client";
import { useEffect, useRef, useState } from "react";
import { HOW_IT_WORKS_STEPS } from "@/utils/home/constants";
export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.clientHeight - window.innerHeight;
      const scrolled = -rect.top;

      if (scrolled <= 0) {
        setActiveStep(0);
      } else if (scrolled >= trackHeight) {
        setActiveStep(HOW_IT_WORKS_STEPS.length - 1);
      } else {
        const progress = scrolled / trackHeight;
        const stepIndex = Math.min(
          Math.floor(progress * HOW_IT_WORKS_STEPS.length),
          HOW_IT_WORKS_STEPS.length - 1
        );
        setActiveStep(stepIndex);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section ref={trackRef} id="how" className="relative h-[250vh] bg-[#101010]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 md:px-35">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-12">
          <div className="w-full max-w-xl">
            <h2 className="mb-8 text-sm uppercase tracking-wider text-[#cdeb00]">
              How it works
            </h2>

            <div className="flex flex-col gap-8">
              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div
                    key={step.title || index}
                    className={`transition-all duration-500 ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-25 translate-y-1"
                    }`}
                  >
                    <h3 className="mb-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {HOW_IT_WORKS_STEPS.map((_, index) => {
              const isActive = activeStep === index;
              return (
                <span
                  key={index}
                  className={`w-2.5 rounded-full bg-white transition-all duration-300 ${
                    isActive ? "h-7 opacity-100" : "h-2.5 opacity-40"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}