'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCode, FiLayout, FiZap, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';
import { SiDiscord } from 'react-icons/si';

const services = [
  {
    icon: FiCode,
    title: 'Web Development',
    description: 'Custom websites and web applications with modern front-end (React, Vue, Next.js) and robust back-end (Node.js, Java, PHP) development.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: SiDiscord,
    title: 'Discord Bot Development',
    description: 'Custom Discord bots for management, moderation, tickets, and automation with secure hosting and dashboards.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiLayout,
    title: 'UI/UX Design',
    description: 'Beautiful interface design for web apps and dashboards with responsive, accessible layouts and brand identity.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FiZap,
    title: 'Automation & Integrations',
    description: 'API integration, workflow automation, and seamless connections with Stripe, Discord, Google Cloud, and more.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: FiTrendingUp,
    title: 'Consulting & Support',
    description: 'Technical architecture consulting, code review, performance auditing, and long-term maintenance.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: FiMessageSquare,
    title: 'Client Training',
    description: 'Comprehensive onboarding and training to help you make the most of your digital solutions.',
    color: 'from-orange-500 to-red-500',
  },
];

export default function Services() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete digital solutions for all your development needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card card-hover group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="heading-3 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  href="/services"
                  className="text-primary-600 font-medium inline-flex items-center group-hover:gap-2 transition-all"
                >
                  Learn more
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn btn-primary">
            View all services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}