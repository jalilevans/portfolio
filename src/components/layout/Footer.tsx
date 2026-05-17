const columns = [
  {
    heading: "Work",
    links: [
      { href: "/#work", label: "Projects" },
      { href: "/#about", label: "About" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { href: "mailto:evansjalil49@gmail.com", label: "Email" },
      { href: "/#contact", label: "Get in touch" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-canvas-parchment pt-16 pb-10">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-80 mb-3">
                {heading}
              </p>
              <ul>
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[17px] font-normal leading-[2.41] tracking-[-0.374px] text-ink-muted-80 hover:text-primary transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hairline */}
        <div className="border-t border-hairline mb-6" />

        {/* Legal row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] font-normal leading-none tracking-[-0.12px] text-ink-muted-48">
            Copyright © {new Date().getFullYear()} Jalil Evans. All rights
            reserved.
          </p>
          <p className="text-[12px] font-normal leading-none tracking-[-0.12px] text-ink-muted-48">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
