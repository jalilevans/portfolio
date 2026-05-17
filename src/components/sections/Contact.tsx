import { contact } from "@/content/contact";

export default function Contact() {
  const mailto = `mailto:${contact.email}`;

  return (
    <section id="contact" className="w-full bg-canvas-parchment py-20">
      <div className="max-w-[1440px] mx-auto px-6">
      <div className="max-w-[540px]">
        <h2 className="text-[40px] font-normal leading-[1.1] tracking-[-0.374px] text-ink mb-4">
          Get in Touch
        </h2>
        <p className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80 mb-10">
          I&apos;m open to early-stage opportunities: founding team, lead
          designer, or a place where I can own the product experience
          end-to-end. If that sounds like your team, I&apos;d love to talk.
        </p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[16px] font-normal leading-[1.29] tracking-[-0.224px] text-ink-muted-48 w-20 shrink-0">
              Email
            </span>
            <a
              href={mailto}
              className="text-link text-[16px] font-normal leading-[1.47] tracking-[-0.374px] text-primary hover:text-primary-focus transition-colors"
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[16px] font-normal leading-[1.29] tracking-[-0.224px] text-ink-muted-48 w-20 shrink-0">
              LinkedIn
            </span>
            <a
              href={contact.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link text-[16px] font-normal leading-[1.47] tracking-[-0.374px] text-primary hover:text-primary-focus transition-colors"
            >
              linkedin.com/in/jalil-evans
            </a>
          </div>
          {/* <div className="flex items-center gap-4">
            <span className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48 w-20 shrink-0">
              Resume
            </span>
            <span className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-48">
              Coming soon
            </span>
          </div> */}
        </div>

        <div className="mt-12 -ml-[4px]">
          <a
            href={mailto}
            className="inline-block bg-primary text-white text-[17px] font-normal leading-[1.47] tracking-[-0.374px] rounded-full px-[22px] py-[11px] hover:bg-primary-focus transition-colors active:scale-95"
          >
            Send an Email
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
