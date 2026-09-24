import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { leadProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...leadProjects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
