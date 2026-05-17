import { aboutScrollPhases } from "@/content/about";
import { AboutScrollMedia } from "@/components/sections/AboutScrollMedia";
import { ParticleSpacetimeMesh } from "@/components/ui/ParticleSpacetimeMesh";

export default function About() {
  return (
    <section id="about" className="relative overflow-clip w-full bg-canvas py-20">
      <ParticleSpacetimeMesh />
      <div className="relative max-w-[1440px] mx-auto px-6">
        <AboutScrollMedia
          phases={aboutScrollPhases}
          bioPanel={
            <div>
              <h2 className="text-[40px] font-normal leading-[1.1] tracking-[-0.374px] text-ink mb-8">
                About
              </h2>
              <div className="space-y-4 text-[18px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
                <p>
                  I&apos;m a product designer at Meta, where I&apos;ve spent 5
                  years leading design across craft, growth, and product strategy
                  on Facebook Stories and private sharing. I&apos;m particularly
                  energized by visionary projects, and I lean into interactive
                  prototypes as a form of storytelling. Decks are great, but
                  there&apos;s something powerful about being able to actually see
                  and touch the vision being pitched.
                </p>
                <p>
                  Before Meta, I co-founded Bloom, a community hosting platform
                  that consolidated Slack, Airtable, Mailchimp, and Eventbrite
                  into one tool for community managers. We launched an MVP in four
                  months, signed our first paying customer, and generated 25 demo
                  requests before we graduated.
                </p>
                <p>
                  I graduated from Cornell University in 2021 where I studied
                  information science, startups, and UX design. Currently living
                  in Maryland, but planning a move to Jersey City in January 2027.
                  I&apos;m open to opportunities with early teams where I can own
                  surfaces end-to-end and where design shapes the product strategy.
                </p>
              </div>
            </div>
          }
          buildPanel={
            <div>
              <h3 className="text-[34px] font-normal leading-[1.47] tracking-[-0.374px] text-ink mb-4">
                I lead with prototypes.
              </h3>
              <div className="space-y-4 text-[18px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
                <p>
                  Most designers show you a Figma file. I&apos;ll put something
                  in your hands.
                </p>
                <p>
                  I prototype in mobile and web contexts using Cursor (usually
                  with SwiftUI or React/Next.js).
                </p>
                <p>
                  This makes collaboration much more simple. PMs don&apos;t need
                  to imagine the experience, they can touch it. Engineers
                  don&apos;t need to ask about transitions or motion because
                  it&apos;s all baked into the prototype.
                </p>
                <p>
                  I run a workshop every other week at Meta teaching designers
                  how to prototype with AI tools.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
