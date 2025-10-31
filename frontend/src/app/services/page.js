'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.services.getAll();
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Tous les services' },
    { id: 'web', name: 'Développement Web' },
    { id: 'mobile', name: 'Applications Mobiles' },
    { id: 'design', name: 'Design & UX' },
    { id: 'marketing', name: 'Marketing Digital' },
    { id: 'consulting', name: 'Consulting' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Nos Services</h1>
            <p className="text-xl text-white/90">
              Des solutions sur mesure pour transformer vos idées en réalité digitale
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton h-48 mb-4"></div>
                  <div className="skeleton h-6 w-3/4 mb-2"></div>
                  <div className="skeleton h-4 w-full mb-4"></div>
                  <div className="skeleton h-10 w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun service trouvé dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:shadow-xl transition-shadow"
                >
                  {/* Icon/Image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl text-white">
                      {service.icon || '🚀'}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Features */}
                  {service.features && (
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                          <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  <div className="mb-6">
                    {service.price ? (
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-primary">
                          {formatCurrency(service.price)}
                        </span>
                        <span className="text-gray-500">/ projet</span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-gray-700">Sur devis</span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => router.push(`/services/${service.id}`)}
                    className="btn btn-primary w-full flex items-center justify-center space-x-2 group"
                  >
                    <span>En savoir plus</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Besoin d'un service personnalisé ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contactez-nous pour discuter de votre projet et obtenir un devis sur mesure
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="btn bg-white text-primary hover:bg-gray-100"
            >
              Demander un devis
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}