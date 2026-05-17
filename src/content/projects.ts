import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "discovery-journeys",
    title: "Discovery Journeys",
    cardTitle: "Building a strategy for Stories when your social graph runs dry",
    frame: "Interest-Based Discovery",
    summary:
      "Pitched and secured funding for a 0 → 1 bet for Facebook Stories. 7 ideas landed on the roadmap. Recently launched one feature from the portfolio, resulting in millions of additional story views. Now a full workstream with 8 dedicated engineers.",
    description:
      "Facebook Stories was built around your social graph, but for a growing segment of users, that graph wasn't supplying their tray. I independently identified the inventory problem, developed an interest-based discovery strategy, and pitched it to leadership using prototypes instead of decks. Seven ideas landed on the roadmap. The concept evolved into Discovery Journeys, a fully funded 0→1 workstream with 8 dedicated engineers, reimagining what Stories looks like when creator and interest-based content surfaces alongside connected content.",
    body: [
      "Facebook Stories was built around your social graph. For most users that works — but for a growing segment, their graph wasn't supplying their tray. The people they followed weren't posting. The content wasn't there. I identified this independently, before it was on anyone's brief, by digging into usage data and talking to users who had quietly stopped engaging.",
      "Rather than write a strategy document, I built prototypes. I developed an interest-based discovery framework with seven distinct concept directions and brought them to leadership as interactive demos — things you could tap through and feel, not just read. The argument landed because the ideas were tangible.",
      "Seven concepts made it onto the team's roadmap. Leadership approved funding for a dedicated workstream. Discovery Journeys now has 8 engineers and is actively building.",
      "Since the workstream launched, one feature from the original portfolio has shipped. It resulted in millions of additional story views.",
    ],
    metric:
      "7 ideas landed on the roadmap. One feature has since launched, resulting in millions of additional story views. Now a fully funded workstream with 8 dedicated engineers.",
    tags: ["0 → 1", "Product Strategy", "Prototyping", "Interaction Design"],
    status: "In progress: strategy and funding complete, execution underway",
    role: "Sole Designer, New Stories Experiences",
    team: "8 engineers",
    timeline: "2025 - present",
    image: "/images/projects/Discovery Journeys.png",
    featured: true,
    order: 1,
    endNote:
      "This project is ongoing. The strategy and funding phase is complete, features are shipping, and more results are on the way.",
  },
  {
    slug: "viewer-sheet-vision",
    title: "Viewer Sheet Vision",
    cardTitle: "Creating a vision for the viewer sheet, a surface no one owned",
    frame: "Viewer Sheet Vision",
    summary:
      "82% of Facebook Story posters visit the viewer sheet. It had no owner, no PM, and no vision. I covered both design and product strategy, built a full redesign from first principles, and ran 8 experiments. 4 launched. The work secured H1 2025 funding.",
    description:
      "82% of people who post a Facebook Story swipe up to see who watched it, making the viewer sheet one of the most-visited surfaces in Stories. It had no owner, no PM, and no coherent vision. I was placed on it as the sole designer, held both design and product strategy roles, and built a full redesign vision from first principles: four distinct jobs-to-be-done, design principles, and 8 experiments. Four launched. The work secured H1 2025 funding. A year later, when the team re-engaged with the surface, the original vision is still guiding the work.",
    body: [
      "82% of people who post a Facebook Story swipe up to see who watched it. That makes the viewer sheet one of the most-visited surfaces in all of Stories. It had no dedicated owner, no PM, and no coherent vision for what it should be. I was placed on it as the sole designer.",
      "With no PM to scope the work, I took on both design and product strategy. I started from first principles: what are people actually trying to do when they open this sheet? I identified four distinct jobs-to-be-done, developed design principles from those, and used them to evaluate every idea we ran.",
      "That framework produced 8 experiments. Four launched. I ran the full design-to-ship cycle on each, partnering directly with engineering without a PM in the loop.",
      "The work secured H1 2025 funding for the surface. A year later, the team picked it back up for another round of investment. The original vision is still guiding the work.",
    ],
    metric:
      "8 experiments, 4 launches, and the work directly secured H1 2025 funding, without a PM on the project. A year later, the team picked it back up and the original vision is still guiding the work.",
    tags: [
      "Sole Ownership",
      "Product Strategy",
      "Interaction Design",
      "Visual Design",
    ],
    status: "Complete",
    role: "Sole Designer + de facto PM, Stories Feedback",
    team: "Direct partnership with engineering",
    timeline: "2024",
    image: "/images/projects/Viewersheet.png",
    featured: true,
    order: 2,
  },
  {
    slug: "in-viewer-navigation",
    title: "In-Viewer Navigation",
    cardTitle: "Addressing new user behavior through delightful interaction design",
    frame: "In-Viewer Navigation",
    summary:
      "Users were exiting the Facebook Stories viewer between every story to browse, breaking the ad delivery model. I designed a new navigation pattern, significantly increasing session depth and story monetization rate.",
    description:
      "Users were leaving the Facebook Stories viewer between every story, exiting to browse, then tapping back in. This \"hunt and peck\" behavior had a direct business consequence: you need to stay in the viewer for at least two consecutive stories to be served an ad. Rather than inserting ads earlier into a broken experience (the monetization team's proposal), I redesigned the navigation: a lightweight in-viewer tray lets users browse upcoming stories without exiting. Session depth increased. Story monetization rate increased +3.7%. The experience improved and so did the business outcome.",
    body: [
      "Users were leaving the Facebook Stories viewer between every story. They'd exit to the tray, browse what was available, then tap back in. This \"hunt and peck\" pattern had a direct business consequence: to be served an ad, a user needs to stay in the viewer for at least two consecutive stories. Most weren't.",
      "The monetization team's proposal was to push ads earlier into the session. I pushed back. Inserting more ads into a broken experience doesn't fix the experience — it just makes it worse faster. The right solution was to fix the navigation.",
      "I redesigned the viewer to include a lightweight in-viewer tray that lets users browse upcoming stories without ever leaving. The interaction is subtle: a small peek at what's next, accessible without breaking the current story. Users stay in the viewer. The experience feels better. The ad model works as intended.",
      "Session depth increased. Story monetization rate increased +3.7%. At Facebook's scale, a sub-1% improvement represents millions of incremental daily interactions — 3.7% is significant.",
    ],
    metric:
      "Strong test results: lifted story engagement and story monetization rate +3.7%. At Facebook's scale, even a sub-1% improvement represents millions of incremental daily interactions.",
    tags: [
      "Interaction Design",
      "Prototyping",
      "Monetization",
    ],
    status: "Launched",
    role: "Designer, Stories Consumption",
    collaborators: "Monetization (Ads) team + Stories Consumption team",
    timeline: "2025",
    image: "/images/projects/In Viewer Navigation.png",
    featured: true,
    order: 3,
  },
];
