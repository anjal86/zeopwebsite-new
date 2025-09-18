import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Zeo Tourism - Nepal Tours, Travel & Holiday Packages',
  description = 'Discover Nepal with Zeo Tourism. Customized tour packages, cultural holidays, adventure travel, and spiritual journeys. 25+ years of Nepal travel expertise.',
  keywords = 'Nepal tours, Nepal travel packages, Nepal holidays, cultural tours Nepal, adventure travel, spiritual journeys, luxury travel Nepal, Nepal vacation packages',
  image = 'https://zeotourism.com/images/og-image.jpg',
  url = 'https://zeotourism.com',
  type = 'website',
  structuredData = []
}) => {
  const fullTitle = title.includes('Zeo Tourism') ? title : `${title} | Zeo Tourism`;

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
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');

    // Update Open Graph meta tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', 'Zeo Tourism', true);

    // Update Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Handle structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    structuredData.forEach((data, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      script.setAttribute('data-seo-script', `${index}`);
      document.head.appendChild(script);
    });

    // Cleanup function to remove structured data scripts when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[data-seo-script]');
      scripts.forEach(script => script.remove());
    };
  }, [fullTitle, description, keywords, image, url, type, structuredData]);

  // This component doesn't render anything visible
  return null;
};

export default SEO;