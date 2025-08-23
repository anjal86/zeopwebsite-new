import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import About from '../components/About/About';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <PageHeader
        title="Travel With Purpose & Passion"
        subtitle="For over 15 years, we've been crafting journeys that go beyond sightseeing. We create connections – with nature, culture, and the extraordinary people who call these mountains home."
        breadcrumb="About"
        backgroundImage="https://images.unsplash.com/photo-1523365280197-f1783db9fe62?q=80&w=2070"
      />
      
      <About />
    </div>
  );
};

export default AboutPage;