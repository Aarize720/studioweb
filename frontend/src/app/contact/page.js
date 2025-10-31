'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { SiDiscord } from 'react-icons/si';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { contactAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.send(formData);
      toast.success('Message sent successfully! We will respond as soon as possible.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20 mt-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="heading-1 mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Have a question or project? Join our Discord community or send us a message
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="heading-3 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Discord */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SiDiscord className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Discord Community</h3>
                      <a href="https://discord.gg/4qEUNSVjQF" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                        Join our Discord Server
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Best way to reach us!</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Why Discord */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card bg-gradient-to-br from-primary-50 to-secondary-50"
              >
                <h3 className="font-semibold mb-4">Why Discord?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Fastest response time</p>
                  <p>✓ Direct communication with our team</p>
                  <p>✓ Community support</p>
                  <p>✓ Project updates & announcements</p>
                  <p>✓ Share files & screenshots easily</p>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="card">
                <h2 className="heading-3 mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      placeholder="Project inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="input"
                      placeholder="Describe your project or inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full group"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                    <FiSend className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}