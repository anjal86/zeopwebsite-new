import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import About from '../components/About/About';
import SEO from '../components/SEO/SEO';

const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - Zeo Tourism | 13+ Years of Professional Travel Expertise"
        description="Founded in 2018 and headquartered in Kathmandu, Zeo Tourism Pvt. Ltd. delivers world-class travel experiences. Also registered in Dubai as ZEO Tourism LLC. 13+ years of expertise in customized international packages, corporate tours, and complete travel solutions."
        keywords="about zeo tourism, travel company Nepal, Dubai travel agency, ZEO Tourism LLC, customized travel packages, corporate incentive tours, visa processing, MICE"
        url="https://zeotourism.com/about"
        type="website"
      />

      <div className="about-page">
        <PageHeader
          title="About Zeo Tourism"
          subtitle="Founded in 2018 with over 13 years of professional expertise, we craft authentic travel experiences across Nepal, Asia, and the Middle East."
          breadcrumb="About"
          backgroundImage="https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070&auto=format&fit=crop"
        />

        <About />
      </div>
    </>
  );
};

export default AboutPage;