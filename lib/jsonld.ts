export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ProtoA",
    description:
      "中小企業向けDXコンサルティング。親しみやすいアプローチでデジタル化を支援します。",
    url: "https://protoa.digital",
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ProtoA",
    description: "中小企業向けDXコンサルティング",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
    },
  };
}

export function eventJsonLd({
  name,
  description,
  startDate,
  location,
  url,
}: {
  name: string;
  description?: string;
  startDate: string;
  location?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description: description || name,
    startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(location && {
      location: {
        "@type": "Place",
        name: location,
      },
    }),
    organizer: {
      "@type": "Organization",
      name: "ProtoA",
      url: "https://protoa.digital",
    },
    url,
  };
}

export function caseStudyJsonLd({
  title,
  description,
  date,
  url,
  industry,
}: {
  title: string;
  description: string;
  date?: string;
  url: string;
  industry?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    ...(date && { datePublished: date }),
    ...(industry && { about: industry }),
    publisher: {
      "@type": "Organization",
      name: "ProtoA",
    },
    url,
  };
}

export function blogPostingJsonLd({
  title,
  description,
  date,
  author,
  url,
}: {
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "ProtoA",
    },
    url,
  };
}
