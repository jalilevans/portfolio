export interface AboutScrollPhase {
  image: string;
  alt: string;
}

/** Order matches scroll panels: bio, I build to think. */
export const aboutScrollPhases: AboutScrollPhase[] = [
  { image: "/images/Jalil.png", alt: "Jalil Evans" },
  {
    image: "/images/About-placeholder-1.png",
    alt: "Workshop and prototyping",
  },
];

export interface TimelineEntry {
  year: string;
  title: string;
  detail: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export const timeline: TimelineEntry[] = [
  {
    year: "Sep 2022 – present",
    title: "Product Designer at Meta, Facebook Stories",
    detail:
      "Mid-level designer embedded in teams of 10–12 engineers. Leading design of both growth & 0 → 1 features for Facebook Story production, consumption, and feedback. Rated Exceeded or Greatly Exceeded Expectations every cycle.",
  },
  {
    year: "Oct 2021 - Sep 2022",
    title: "Product Designer at Meta, Private Sharing",
    detail:
      "Entry level designer building features to accomodate for increased rates of in-app sharing. Rated Exceeded or Greatly Exceeded Expectations every cycle.",
  },
  {
    year: "Aug 2019 - June 2021",
    title: "Co-founded Bloom",
    detail:
      "Partnered with one full-stack engineer to build a community hosting platform while in college. MVP in 4 months, achieved first paying customer, 25 demo requests, and landed a YC interview.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "I believe he's one of the strongest PDs I've worked with as evidenced by the quality and breadth of design explorations he's shown to our team time and time again.",
    name: "Stephanie Kan",
    title: "Product Manager, Meta",
  },
  {
    quote:
      "Operates autonomously: Jalil operates independently without any day-to-day guidance from me… resting assured that he has everything under control.",
    name: "Jake Deakin",
    title: "Product Design Manager, Meta",
  },
  {
    quote:
      "His strategic thinking around interest discovery and his collaborative spirit have made a significant impact in defining the vision for the product. He was very proactive… quickly building prototypes, spending time figuring out the details and sharing it broadly to get feedback.",
    name: "Shubham Gupta",
    title: "Product Manager, Meta",
  },
  {
    quote:
      "Jalil goes out of his way to do exhaustive research on competitive landscape and competitors, which have created for thoughtful and nuanced designs and options.",
    name: "Shubham Gupta",
    title: "Product Manager, Meta",
  },
];

export const skills: SkillCategory[] = [
  {
    category: "Design",
    items: [
      "Product Thinking",
      "Interaction Design",
      "Prototyping",
      "Design Systems",
      "Visual Design",
    ],
  },
  {
    category: "Strategy",
    items: [
      "0 → 1 Product Strategy",
      "Growth Strategy",
      "Roadmap Development",
      "Cross-functional Alignment",
      "Design Sprints"
    ],
  },
  {
    category: "Research",
    items: ["User Research", "Jobs-to-be-Done", "A/B Testing", "KPIs & Metrics"],
  },
  {
    category: "Tools",
    items: ["Figma", "Origami Studio", "Cursor", "SwiftUI, React, Next.js"],
  },
];
