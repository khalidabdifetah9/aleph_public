import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#101010] min-h-[500px]">
        <div className="relative max-w-6xl pl-30 pb-20 pt-10 md:pt-28">
          <div className="w-full text-left">
            <h1 className="text-[#cdeb00] text-lg">Verified talent, on both sides</h1>
            <h1 className="text-balance font-display capitalize text-white text-4xl mt-4 font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Where exceptional talent meets meaningful opportunities and great{" "}
              <span className="text-[#cdeb00] mb-5">work begins</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[#cdeb00] flex justify-around w-screen relative">
        <div className="absolute right-0 top-[-120px] w-[50%] h-[calc(100%+120px)] z-10">
          <div className="relative w-full h-full">
            <Image
              width={700}
              height={800}
              alt="people network"
              src="/ntw.jpg"
              className="object-cover object-top rounded-l-[40px] shadow-2xl"
              style={{
                clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          <div 
            className="absolute inset-0 rounded-l-[40px]"
            style={{
              background: "linear-gradient(to right, rgba(16,16,16,0.3), transparent 30%)",
              clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>

        <div className="relative z-20 max-w-6xl w-full flex justify-between items-center py-24 px-5">
          <div className="w-[50%]">
            <div className="pt-5">
              <p className="text-xl leading-9 max-w-xl font-semibold tracking-widest text-balance capitalize text-[#101010]">
                Join a trusted marketplace built to connect ambitious businesses
                with exceptional professionals. Post your project in minutes,
                receive proposals from verified experts, explore portfolios,
                compare experience, and hire with complete confidence. From
                creative design and web development to marketing, writing, and
                digital services, we make it easy to find the right talent,
                collaborate seamlessly, and turn great ideas into successful
                outcomes.
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-10">
              <Link
                className="px-10 py-3 bg-[#101010] text-white font-semibold capitalize rounded-lg hover:bg-[#2a2a2a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                href="/signup?role=CLIENT"
              >
                Post a job
              </Link>
              <Link
                className="px-10 py-3 bg-[#101010] text-white font-semibold capitalize rounded-lg hover:bg-[#2a2a2a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                href="/signup?role=DESIGNER"
              >
                Get a job
              </Link>
            </div>
          </div>

          <div className="w-[50%]"></div>
        </div>
      </section>
    </main>
  );
}