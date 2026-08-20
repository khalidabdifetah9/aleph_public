"use client";
import {ALEPH_FAQS} from "@/utils/home/constants"
import { useState } from "react";
import { SectionHeading } from "./SectionHeading";


export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <SectionHeading
        eyebrow="Got Questions?"
        title="Frequently Asked Questions about alephjobs"
      />

      <div className="mt-12 flex flex-col gap-4">
        {ALEPH_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-[#cdeb00] bg-[#101010]"
                  : "border-border/60 bg-card hover:border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span
                  className={`text-lg font-semibold transition-colors ${
                    isOpen ? "text-[#cdeb00]" : "text-foreground"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-transform duration-300 ${
                    isOpen
                      ? "rotate-45 bg-[#cdeb00] text-[#101010]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-base leading-relaxed text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}