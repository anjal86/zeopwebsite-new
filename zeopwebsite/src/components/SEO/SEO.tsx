import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object[];
  langUrls?: Record<string, string>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Zeo Tourism - Nepal Tours, Travel & Holiday Packages',
  description = 'Expert Nepal tours & spiritual journeys with Zeo Tourism. 25+ years experience in customized adventure and cultural travel.',
  keywords = 'Zeo Tourism, Zeo Tourism Nepal, Nepal tours, Nepal travel packages, Nepal holidays, trekking in Nepal, spiritual journeys Nepal, Mount Kailash Yatra, Everest Base Camp trek, cultural tours Nepal, adventure travel Asia, luxury Nepal travel, local tour operator Nepal',
  image = 'https://zeotourism.com/images/og-image.jpg',
  url = 'https://zeotourism.com',
  type = 'website',
  structuredData = [],
  langUrls = {}
}) => {
  const fullTitle = title.includes('Zeo Tourism') ? title : `${title} | Zeo Tourism`;

  // Truncate description to 155 characters for SEO safety
  const safeDescription = description.length > 155
    ? description.substring(0, 152) + '...'
    : description;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', safeDescription);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');

    // Update Open Graph meta tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', safeDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', 'Zeo Tourism', true);

    // Update Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', safeDescription);
    updateMetaTag('twitter:image', image);

    // Handle Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Handle hreflang tags
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(tag => tag.remove());

    const finalLangUrls = Object.keys(langUrls).length > 0
      ? langUrls
      : { 'en': url, 'x-default': url };

    Object.entries(finalLangUrls).forEach(([lang, langUrl]) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', langUrl as string);
      document.head.appendChild(link);
    });

    // Handle structured data
    // ONLY remove scripts that this component added (using the data attribute)
    const existingScripts = document.querySelectorAll('script[data-seo-script]');
    existingScripts.forEach(script => script.remove());

    structuredData.forEach((data, index) => {
      if (!data) return;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      script.setAttribute('data-seo-script', `dynamic-${index}`);
      document.head.appendChild(script);
    });

    // Cleanup function to remove structured data scripts and hreflang tags when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[data-seo-script]');
      scripts.forEach(script => script.remove());

      const hreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
      hreflangs.forEach(tag => tag.remove());
    };
  }, [fullTitle, description, keywords, image, url, type, structuredData, langUrls]);

  // This component doesn't render anything visible
  return null;
};

export default SEO;