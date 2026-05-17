import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import Badge from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} | Jalil Evans` };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="max-w-[680px] mx-auto px-6 py-20">
      {project.image && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-[18px]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 680px"
            priority
            unoptimized={
              project.image.endsWith(".gif") ||
              project.image.startsWith("/")
            }
          />
        </div>
      )}

      <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink-muted-48 mb-4">
        {project.frame}
      </p>

      <h1 className="text-[34px] font-normal leading-[1.47] tracking-[-0.374px] text-ink mb-3">
        {project.title}
      </h1>
      <p className="text-[21px] font-normal leading-[1.14] tracking-[0.196px] text-ink-muted-80 mb-10">
        {project.cardTitle}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        <div>
          <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink-muted-48 mb-1">
            Timeline
          </h3>
          <p className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink">
            {project.timeline}
          </p>
        </div>
        <div>
          <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink-muted-48 mb-1">
            Role
          </h3>
          <p className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink">
            {project.role}
          </p>
        </div>
        {project.team && (
          <div>
            <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink-muted-48 mb-1">
              Team
            </h3>
            <p className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink">
              {project.team}
            </p>
          </div>
        )}
        <div>
          <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink-muted-48 mb-1">
            Status
          </h3>
          <p className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink">
            {project.status}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {project.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <hr className="border-hairline mb-10" />

      <div className="mb-10 space-y-4">
        {(project.body ?? [project.description]).map((paragraph, i) => (
          <p key={i} className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="rounded-[18px] border border-hairline bg-canvas-parchment p-6 mb-10">
        <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink-muted-48 mb-2">
          Outcome
        </h3>
        <p className="text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
          {project.metric}
        </p>
      </div>

      {project.endNote && (
        <p className="text-[14px] font-normal leading-[1.43] tracking-[-0.224px] text-ink-muted-48 italic border-t border-hairline pt-6">
          {project.endNote}
        </p>
      )}

      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link mt-8 inline-block text-[17px] font-normal leading-[1.47] tracking-[-0.374px] text-primary hover:text-primary-focus transition-colors underline underline-offset-4"
        >
          View Project →
        </a>
      )}
    </article>
  );
}
