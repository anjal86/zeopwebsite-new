import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import About from '../components/About/About';
import SEO from '../components/SEO/SEO';

const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - Zeo Tourism | 25+ Years of Authentic Travel Experiences"
        description="Discover Zeo Tourism's story. Founded by mountain guides, we've been creating authentic travel experiences across Nepal, Asia, and the Middle East for over 25 years."
        keywords="about zeo tourism, travel company Nepal, authentic travel experiences, mountain guides, sustainable tourism, cultural immersion"
        url="https://zeotourism.com/about"
        type="website"
      />
      
      <div className="about-page">
        <PageHeader
          title="About Zeo Tourism"
          subtitle="For over 25 years, we've been crafting authentic travel experiences that connect you with the world's most extraordinary destinations."
          breadcrumb="About"
          backgroundImage="https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070&auto=format&fit=crop"
        />
        
        <About />
      </div>
    </>
  );
};

export default AboutPage;