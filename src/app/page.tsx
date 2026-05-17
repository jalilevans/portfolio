import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import SkillsExperience from "@/components/sections/SkillsExperience";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import { FadeInView } from "@/components/ui/FadeInView";

export default function Home() {
  return (
    <>
      <Hero />
      <section id="work" className="w-full bg-canvas-parchment py-20">
        <div className="max-w-[1440px] mx-auto px-6 mb-10">
          <FadeInView>
            <h2 className="text-[40px] font-normal leading-[1.1] tracking-[-0.374px] text-ink mb-10">
              Selected Projects
            </h2>
          </FadeInView>
        </div>
        <Projects featured />
      </section>
      <About />
      <SkillsExperience />
      <Testimonials />
      <Contact />
    </>
  );
}
