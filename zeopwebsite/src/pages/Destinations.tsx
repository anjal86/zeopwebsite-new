import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader';
import Destinations from '../components/Destinations/Destinations';

const DestinationsPage: React.FC = () => {
  return (
    <div className="destinations-page">
      <PageHeader
        title="Destinations"
        subtitle="Discover your next adventure"
        breadcrumb="Destinations"
        backgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070"
      />
      
      <Destinations />
    </div>
  );
};

export default DestinationsPage;