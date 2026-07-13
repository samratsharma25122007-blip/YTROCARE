import type { Metadata } from "next";
import BookForm from "@/components/book/BookForm";
import Particles from "@/components/ui/Particles";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Book Your RO Service — AutoCare",
  description:
    "Book a premium, certified RO water purifier service at your doorstep. Same-day slots available.",
};

export default function BookPage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-brand-ink pb-28 pt-36 md:pt-44">
      <Particles count={34} color="0,92,255" maxSize={2} speed={0.15} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl px-6 md:px-10">
        <div className="text-center">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-glow">
              <span className="h-1 w-1 rounded-full bg-current" />
              Doorstep · Same-day slots
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tightest text-white sm:text-5xl md:text-6xl">
              Book Your RO Service
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-white/55">
              Fill in a few details and a certified engineer will take it from
              here. It takes less than a minute.
            </p>
          </Reveal>
        </div>

        <div className="mt-14">
          <BookForm />
        </div>
      </div>
    </section>
  );
}
