export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Proto-A",
    description:
      "宮古島の中小企業向けDXコンサルティング。地元に根ざした親しみやすいアプローチでデジタル化を支援します。",
    url: "https://proto-a.com",
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Proto-A",
    description: "DXコンサルティング - 宮古島",
    address: {
      "@type": "PostalAddress",
      addressLocality: "宮古島市",
      addressRegion: "沖縄県",
      addressCountry: "JP",
    },
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
      name: "Proto-A",
    },
    url,
  };
}
