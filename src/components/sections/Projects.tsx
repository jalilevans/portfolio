import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface Props {
  featured?: boolean;
}

export default function Projects({ featured = false }: Props) {
  const displayed = featured
    ? projects
        .filter((p) => p.featured)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    : [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const trackClass = featured
    ? "flex flex-row flex-nowrap gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory featured-track-pl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-8 -my-8"
    : "grid grid-cols-1 md:grid-cols-2 gap-6";

  return (
    <div
      className={trackClass}
      {...(featured
        ? { role: "region", "aria-label": "Featured projects" }
        : {})}
    >
      {displayed.map((project) => (
        <ProjectCard key={project.slug} project={project} featured={featured} />
      ))}
      {featured ? (
        <div className="shrink-0 w-6 max-sm:w-3" aria-hidden />
      ) : null}
    </div>
  );
}
