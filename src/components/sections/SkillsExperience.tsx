import { skills } from "@/content/about";
import { ExperienceExpandableWithDraw } from "@/components/sections/skills/ExperienceExpandableWithDraw";

export default function SkillsExperience() {
  return (
    <section id="skills" className="w-full bg-surface-tile-1 pt-36 pb-28 min-h-[720px]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-x-14 md:gap-y-0 items-start">
          {/* Skills column */}
          <div>
            <h2 className="text-[20px] font-normal leading-[1.24] tracking-[-0.374px] text-white/40 mb-6">
              Skills
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {skills.map(({ category, items }) => (
                <div key={category}>
                  <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-white mb-2">
                    {category}
                  </p>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-white/60"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Experience column */}
          <div>
            <h2 className="text-[20px] font-normal leading-[1.24] tracking-[-0.374px] text-white/40 mb-6">
              Experience
            </h2>
            <ExperienceExpandableWithDraw />
          </div>
        </div>
      </div>
    </section>
  );
}
