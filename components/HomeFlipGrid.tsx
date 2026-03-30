"use client";

import { useState } from "react";
import { GraduationCap, Handshake, ChevronDown } from "lucide-react";

type ServiceData = {
  key: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: "training" | "accompaniment";
  label: string;
  ctaLabel: string;
  ctaHref: string;
};

type CaseStudyData = {
  slug: string;
  title: string;
  excerpt: string;
  industry: string;
  tags: string[];
  challengeLabel: string;
  solutionLabel: string;
  challenge: string;
  solution: string;
  ctaLabel: string;
  ctaHref: string;
};

const iconMap = {
  training: GraduationCap,
  accompaniment: Handshake,
};

export default function HomeFlipGrid({
  services,
  caseStudies,
  sectionLabel,
  viewAllLabel,
  viewAllHref,
  servicesLabel,
  caseStudiesLabel,
}: {
  services: ServiceData[];
  caseStudies: CaseStudyData[];
  sectionLabel: string;
  viewAllLabel: string;
  viewAllHref: string;
  servicesLabel: string;
  caseStudiesLabel: string;
}) {
  const [open, setOpen] = useState<"services" | "cases" | null>(null);

  const toggle = (panel: "services" | "cases") => {
    setOpen((prev) => (prev === panel ? null : panel));
  };

  return (
    <div>
      {(sectionLabel || viewAllLabel) && (
        <div className="flex items-end justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {sectionLabel}
          </p>
          {viewAllLabel && (
            <a
              href={viewAllHref}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              {viewAllLabel} →
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Summary tiles */}
        <div className={`grid gap-3 ${services.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
          {services.length > 0 && (
            <button
              onClick={() => toggle("services")}
              className={`rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 min-h-[140px] ${
                open === "services"
                  ? "bg-[#eaad63] text-white shadow-lg"
                  : "bg-[#f0e6d3] text-foreground"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                open === "services" ? "bg-white/20" : "bg-primary/10"
              }`}>
                <GraduationCap className={`h-5 w-5 ${open === "services" ? "text-white" : "text-primary"}`} />
              </div>
              <span className="text-sm font-bold">{servicesLabel}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                open === "services" ? "rotate-180 text-white/70" : "text-muted-foreground"
              }`} />
            </button>
          )}

          <button
            onClick={() => toggle("cases")}
            className={`rounded-2xl p-6 flex items-center justify-between text-left transition-all duration-300 ${
              open === "cases"
                ? "bg-[#eaad63] text-white shadow-lg"
                : "bg-[#f0e6d3] text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                open === "cases" ? "bg-white/20" : "bg-primary/10"
              }`}>
                <span className="text-lg">📄</span>
              </div>
              <span className="text-base font-bold">{caseStudiesLabel}</span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 flex-shrink-0 ${
              open === "cases" ? "rotate-180 text-white/70" : "text-muted-foreground"
            }`} />
          </button>
        </div>

        {/* Detail panels */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {open === "services" && (
              <div className="flex flex-col gap-3 pb-1">
                {services.map((service) => {
                  const Icon = iconMap[service.icon];
                  return (
                    <div
                      key={service.key}
                      className="rounded-2xl border border-border bg-white p-4"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        {service.description}
                      </p>
                      <ul className="space-y-1.5 mb-4">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground leading-snug">
                            <svg className="mt-0.5 h-3 w-3 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={service.ctaHref}
                        className="inline-flex items-center text-xs font-bold text-primary hover:underline"
                      >
                        {service.ctaLabel} →
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {open === "cases" && (
              <div className="flex flex-col gap-3 pb-1">
                {caseStudies.map((study) => (
                  <a
                    key={study.slug}
                    href={study.ctaHref}
                    className="rounded-2xl border border-border bg-white p-4 block"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-foreground">
                        {study.industry}
                      </span>
                      {study.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-snug mb-2">
                      {study.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {study.challenge}
                    </p>
                    <p className="mt-3 text-sm font-bold text-primary">{study.ctaLabel} →</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
