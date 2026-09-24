import { site } from "@/content/site";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { LeadProjects } from "@/components/sections/LeadProjects";
import { SecondaryProjects } from "@/components/sections/SecondaryProjects";
import { BeyondWork } from "@/components/sections/BeyondWork";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.github, site.linkedin],
};

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <Experience />
      <LeadProjects />
      <SecondaryProjects />
      <BeyondWork />
    </main>
  );
}
