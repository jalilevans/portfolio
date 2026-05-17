import { testimonials } from "@/content/about";
import { FadeInView } from "@/components/ui/FadeInView";
import { ParticleSpacetimeMesh } from "@/components/ui/ParticleSpacetimeMesh";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden w-full bg-canvas py-20"
      aria-labelledby="testimonials-heading"
    >
      <ParticleSpacetimeMesh />
      <div className="relative mx-auto max-w-[1440px] px-6">
        <FadeInView>
          <h2
            id="testimonials-heading"
            className="mb-8 text-[40px] font-normal leading-[1.1] tracking-[-0.374px] text-ink"
          >
            What My Colleagues Say
          </h2>
        </FadeInView>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <FadeInView key={i} delay={i * 0.1}>
              <blockquote className="rounded-[18px] border border-hairline bg-canvas-parchment p-6">
                <p className="mb-4 text-[18px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="text-[16px] font-normal leading-[1.43] tracking-[-0.224px] text-ink-muted-48">
                  {t.name}, {t.title}
                </footer>
              </blockquote>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
