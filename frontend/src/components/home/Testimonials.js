'use client';

import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'CEO, TechStart',
    content: 'Horizon Studio a transformé notre vision en une plateforme web exceptionnelle. Leur expertise et leur professionnalisme sont remarquables.',
    rating: 5,
    avatar: null,
  },
  {
    name: 'Pierre Martin',
    role: 'Directeur Marketing, ShopPlus',
    content: 'Une équipe réactive et créative qui a su comprendre nos besoins. Notre site e-commerce dépasse toutes nos attentes.',
    rating: 5,
    avatar: null,
  },
  {
    name: 'Sophie Laurent',
    role: 'Fondatrice, BeautyBox',
    content: 'Excellent travail sur notre application mobile. L\'interface est intuitive et nos clients adorent l\'expérience utilisateur.',
    rating: 5,
    avatar: null,
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 mb-4">Ce que disent nos clients</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre priorité
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}