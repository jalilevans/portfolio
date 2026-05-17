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
                  years across craft, growth, and product strategy on Facebook
                  Stories. I prototype in SwiftUI, use AI to move faster than
                  expected, and I&apos;d rather put something in your hands than
                  walk you through a deck.
                </p>
                <p>
                  Before Meta, I co-founded Bloom, a community hosting platform
                  that consolidated Slack, Airtable, Mailchimp, and Eventbrite
                  into one tool for community managers. We launched an MVP in four
                  months, signed our first paying customer, and generated 25 demo
                  requests before we graduated.
                </p>
                <p>
                  I&apos;m looking for an early team where I can own surfaces
                  end-to-end and where design actually shapes what the product
                  becomes.
                </p>
              </div>
            </div>
          }
          buildPanel={
            <div>
              <h3 className="text-[34px] font-normal leading-[1.47] tracking-[-0.374px] text-ink mb-4">
                I build to think.
              </h3>
              <div className="space-y-4 text-[18px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
                <p>
                  Most designers show you a Figma file. I&apos;ll put something
                  in your hands.
                </p>
                <p>
                  I prototype in SwiftUI using Cursor, which means my
                  explorations are interactive, native-feeling, and playable, not
                  just clickable screens. This changes the conversation.
                  Engineers stop asking &quot;but how would this really
                  feel?&quot; and start actually feeling it. PMs don&apos;t need
                  to imagine the experience. They can touch it.
                </p>
                <p>
                  I run a workshop every other week at Meta teaching designers
                  how to prototype with AI tools. The goal isn&apos;t to replace
                  engineering. It&apos;s to compress the distance between an idea
                  and something real enough to make a real decision.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
