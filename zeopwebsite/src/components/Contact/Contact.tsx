import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, Globe, CheckCircle } from 'lucide-react';
import { useContact } from '../../hooks/useApi';

const Contact: React.FC = () => {
  const { data: contactInfo } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelers: '',
    date: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelers: '',
        date: '',
        message: ''
      });
    }, 2000);
  };

  const contactDetails = [
    {
      icon: Phone,
      title: 'Phone',
      details: [
        contactInfo?.contact.phone.display || '+977 985 123 4567',
        contactInfo?.contact.phone.secondary || '+977 1-4123456'
      ],
      color: 'text-sky-blue'
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        contactInfo?.contact.email.primary || 'info@zeotourism.com',
        contactInfo?.contact.email.booking || 'booking@zeotourism.com'
      ],
      color: 'text-sunrise-orange'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: [
        contactInfo?.contact.address.street || 'Thamel, Kathmandu',
        contactInfo?.contact.address.full || 'Nepal 44600'
      ],
      color: 'text-earth-green'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: [
        contactInfo?.business.hours.display || 'Mon-Sat: 9AM-6PM',
        contactInfo?.business.support.availability || '24/7 Support Available'
      ],
      color: 'text-purple-600'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-sky-blue mr-2" />
            <span className="text-sky-blue font-semibold text-lg">Get In Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Start Your <span className="text-gradient">Adventure Today</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to explore? Fill out the form below or reach out directly. 
            Our travel experts are here to help you plan the perfect journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Book Your Trip
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300"
                    />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="">Select Destination</option>
                      <option value="everest">Everest Base Camp</option>
                      <option value="kailash">Kailash Mansarovar</option>
                      <option value="annapurna">Annapurna Circuit</option>
                      <option value="kathmandu">Kathmandu Valley</option>
                      <option value="langtang">Langtang Valley</option>
                      <option value="pokhara">Pokhara</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="number"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                      min="1"
                      placeholder="Number of Travelers"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      placeholder="Preferred Date"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300"
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your dream trip..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20 transition-all duration-300 resize-none"
                  />
                </motion.div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {contactInfo?.business.support.response_time ? `We'll get back to you ${contactInfo.business.support.response_time.toLowerCase()}` : "We'll get back to you within 24 hours"}
                  </p>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r from-sky-blue to-sky-blue-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loader mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Inquiry
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Success Message */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl flex items-center"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-green-800">
                    Thank you for your inquiry! We'll contact you soon.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Contact Cards */}
            {contactDetails.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-full bg-gray-50 ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* WhatsApp CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-2">Chat on WhatsApp</h4>
              <p className="text-sm text-white/90">
                Get instant responses to your queries
              </p>
            </motion.div>

            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden shadow-lg h-64">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
