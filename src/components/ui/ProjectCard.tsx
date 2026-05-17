"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { ProjectCardTagRow } from "@/components/ui/ProjectCardTagRow";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const spring = { type: "spring" as const, stiffness: 300, damping: 22 };

const cardVariants = {
  rest: { scale: 1, boxShadow: "rgba(0,0,0,0) 0px 0px 0px" },
  hover: { scale: 1.02, boxShadow: "rgba(0,0,0,0.08) 0px 12px 32px" },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      transition={spring}
      style={{ borderRadius: 18 }}
      className={
        featured
          ? "block h-full w-[min(100%,85vw)] max-w-[420px] shrink-0 snap-start sm:max-w-[440px] xl:max-w-[560px] 2xl:max-w-[620px]"
          : "block h-full"
      }
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block h-full"
      >
        <Card className="h-full group hover:border-primary/30 transition-colors overflow-hidden p-2 flex flex-col gap-2">
          {project.image && (
            <div className="relative w-full shrink-0 aspect-video overflow-hidden rounded-[10px]">
              <motion.div
                className="absolute inset-0"
                variants={imageVariants}
                transition={spring}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes={
                    featured
                      ? "(max-width: 768px) 85vw, (max-width: 1280px) 440px, (max-width: 1536px) 560px, 620px"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  unoptimized={
                    project.image.endsWith(".gif") ||
                    project.image.startsWith("/")
                  }
                />
              </motion.div>
            </div>
          )}
          <div className="min-w-0 flex flex-col flex-1 pb-4 pt-4">
            <p className="text-[16px] font-normal leading-[1.29] tracking-[-0.224px] text-ink-muted-48 mb-3">
              {project.frame}
            </p>
            <h3 className="text-[18px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink mb-2 group-hover:text-primary transition-colors">
              {project.cardTitle}
            </h3>
            <p className="text-[16px] font-normal leading-[1.43] tracking-[-0.224px] text-ink-muted-80 mb-4 line-clamp-3">
              {project.summary ?? project.description}
            </p>
            <div className="mt-auto space-y-3">
              <p className="text-[16px] font-normal leading-[1.43] tracking-[-0.224px] text-ink-muted-48">
                {project.timeline} · {project.role}
              </p>
              <ProjectCardTagRow tags={project.tags} />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
