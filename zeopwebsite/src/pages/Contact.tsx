import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import Contact from '../components/Contact/Contact';
import { useContact } from '../hooks/useApi';

const ContactPage: React.FC = () => {
  const { data: contactInfo } = useContact();
  
  return (
    <div className="contact-page">
      <PageHeader
        title="Start Your Adventure Today"
        subtitle="Ready to explore? Fill out the form below or reach out directly. Our travel experts are here to help you plan the perfect journey."
        breadcrumb="Contact"
        backgroundImage="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"
      />
      
      <Contact />
    </div>
  );
};

export default ContactPage;