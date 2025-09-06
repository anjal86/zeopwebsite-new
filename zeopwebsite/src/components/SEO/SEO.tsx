import React from 'react';
import { Helmet } from 'react-helmet-async';

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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Zeo Tourism" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;