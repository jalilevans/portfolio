export interface Project {
  slug: string;
  title: string;
  cardTitle: string;
  frame: string;
  description: string;
  summary?: string;
  body?: string[];
  metric: string;
  tags: string[];
  status: string;
  role: string;
  team?: string;
  collaborators?: string;
  timeline: string;
  url?: string;
  repo?: string;
  image?: string;
  featured?: boolean;
  order?: number;
  endNote?: string;
}
