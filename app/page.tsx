import { site } from "@/content/site";
import { Hero } from "@/components/sections/Hero";
import { LeadProjects } from "@/components/sections/LeadProjects";
import { SecondaryProjects } from "@/components/sections/SecondaryProjects";
import { BeyondWork } from "@/components/sections/BeyondWork";
import { Footer } from "@/components/sections/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

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
    <div className="mx-auto w-full max-w-5xl px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <header className="flex items-baseline justify-between pt-8 font-mono text-sm">
        <span className="text-ink font-medium">{site.name}</span>
        <nav aria-label="Sections" className="flex gap-6">
          <a className="text-ink-muted hover:text-pitch transition-colors" href="#work">
            Work
          </a>
          <a className="text-ink-muted hover:text-pitch transition-colors" href="#beyond">
            Beyond
          </a>
          <a className="text-ink-muted hover:text-pitch transition-colors" href="#contact">
            Contact
          </a>
        </nav>
      </header>
      <main>
        <Hero />
        <LeadProjects />
        <SecondaryProjects />
        <BeyondWork />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
