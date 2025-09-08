import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import Contact from '../components/Contact/Contact';
import { useContact } from '../hooks/useApi';

const ContactPage: React.FC = () => {
  const { data: contactInfo } = useContact();
  
  return (
    <div className="contact-page">
      <PageHeader
        title={contactInfo?.company.tagline || "Embrace the Journey"}
        subtitle={contactInfo?.company.description || "Your trusted partner for authentic Himalayan adventures and spiritual journeys. Get in touch with our travel experts to plan your perfect journey."}
        breadcrumb="Contact"
        backgroundImage="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"
      />
      
      <Contact />
    </div>
  );
};

export default ContactPage;