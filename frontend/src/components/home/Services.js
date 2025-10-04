'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCode, FiSmartphone, FiShoppingCart, FiLayout, FiSearch, FiTrendingUp } from 'react-icons/fi';

const services = [
  {
    icon: FiCode,
    title: 'Développement Web',
    description: 'Sites web sur mesure, performants et responsive, adaptés à vos besoins spécifiques.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiSmartphone,
    title: 'Applications Mobiles',
    description: 'Applications iOS et Android natives ou hybrides pour une expérience utilisateur optimale.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiShoppingCart,
    title: 'E-commerce',
    description: 'Boutiques en ligne complètes avec gestion des paiements et des stocks.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FiLayout,
    title: 'UI/UX Design',
    description: 'Interfaces modernes et intuitives pour une expérience utilisateur exceptionnelle.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FiSearch,
    title: 'SEO & Marketing',
    description: 'Optimisation pour les moteurs de recherche et stratégies marketing digitales.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: FiTrendingUp,
    title: 'Consulting',
    description: 'Conseil stratégique pour votre transformation digitale et votre croissance.',
    color: 'from-indigo-500 to-purple-500',
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
          <h2 className="heading-2 mb-4">Nos Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des solutions complètes pour tous vos besoins digitaux
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
                  En savoir plus
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
            Voir tous nos services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}