import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import Contact from '../components/Contact/Contact';
import { useContact } from '../hooks/useApi';
import { createOrganizationSchema, createTravelAgencySchema, createBreadcrumbSchema } from '../utils/schema';

import SEO from '../components/SEO/SEO';

const ContactPage: React.FC = () => {
  const { data: contactInfo } = useContact();

  const structuredData = useMemo(() => [
    createOrganizationSchema(),
    createTravelAgencySchema(),
    createBreadcrumbSchema([
      { name: "Home", url: "https://zeotourism.com" },
      { name: "Contact", url: "https://zeotourism.com/contact" }
    ])
  ], []);

  return (
    <>
      <SEO
        title="Contact Us - Zeo Tourism | Nepal Travel Experts"
        description="Get in touch with Zeo Tourism for expert travel advice and custom Nepal tour packages. We are here to help you plan your perfect journey."
        keywords="contact zeo tourism, nepal travel agency, kathmandu tour operator, booking nepal tours, travel consultation nepal, zeo tourism office location"
        url="https://zeotourism.com/contact"
        structuredData={structuredData}
      />
      <div className="contact-page">
        <PageHeader
          title={contactInfo?.company.tagline || "Embrace the Journey"}
          subtitle={contactInfo?.company.description || "Your trusted partner for authentic Himalayan adventures and spiritual journeys. Get in touch with our travel experts to plan your perfect journey."}
          breadcrumb="Contact"
          backgroundImage="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"
        />

        <Contact />
      </div>
    </>
  );
};

export default ContactPage;