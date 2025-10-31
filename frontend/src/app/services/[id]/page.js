'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiSend, FiChevronRight, FiStar, FiUsers, FiClock, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function ServiceDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [service, setService] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    budget: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
    fetchRelatedProjects();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.services.getById(id);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Erreur lors du chargement des détails du service');
      router.push('/services');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProjects = async () => {
    try {
      const response = await api.portfolio.getAll({ 
        service_id: id,
        limit: 3
      });
      setRelatedProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching related projects:', error);
    }
  };

  const handleQuoteChange = (e) => {
    setQuoteForm({
      ...quoteForm,
      [e.target.name]: e.target.value
    });
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    
    if (!quoteForm.name || !quoteForm.email || !quoteForm.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const quoteData = {
        ...quoteForm,
        service_id: id
      };
      
      await api.services.requestQuote(quoteData);
      
      toast.success('Votre demande de devis a été envoyée avec succès');
      
      // Reset form
      setQuoteForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        budget: 'medium'
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Erreur lors de l\'envoi de la demande de devis');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="skeleton h-10 w-3/4"></div>
        <div className="skeleton h-64"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="skeleton h-96"></div>
          <div className="skeleton h-96"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Service introuvable
          </h3>
          <p className="text-gray-600 mb-6">
            Ce service n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => router.push('/services')}
            className="btn btn-primary"
          >
            Voir tous les services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center space-x-2 mb-6">
            <button 
              onClick={() => router.push('/services')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white/80">Retour aux services</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-white/90 mb-8">{service.short_description}</p>
            
            <div className="flex flex-wrap gap-4">
              <a href="#quote" className="btn bg-white text-primary hover:bg-gray-100">
                Demander un devis
              </a>
              <a href="#features" className="btn btn-outline border-white text-white hover:bg-white/10">
                Découvrir les fonctionnalités
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos de ce service</h2>
              
              <div className="prose prose-lg max-w-none">
                {service.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {service.image && (
                <div className="mt-8 rounded-lg overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              id="features"
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fonctionnalités</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {service.features?.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                      <FiCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notre processus</h2>
              
              <div className="space-y-8">
                {service.process?.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-6">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      {index < service.process.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mx-auto mt-2"></div>
                      )}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Projets similaires</h2>
                  <button 
                    onClick={() => router.push('/portfolio')}
                    className="text-primary font-medium flex items-center"
                  >
                    Voir tous
                    <FiChevronRight className="ml-1" />
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.map((project, index) => (
                    <div 
                      key={project.id}
                      className="group cursor-pointer"
                      onClick={() => router.push(`/portfolio/${project.id}`)}
                    >
                      <div className="rounded-lg overflow-hidden mb-3">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500">{project.category}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tarifs</h2>
              
              <div className="space-y-4">
                {service.packages?.map((pkg, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                      <div className="text-primary font-bold">
                        {pkg.price ? formatCurrency(pkg.price) : 'Sur devis'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                    <ul className="space-y-2">
                      {pkg.features?.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{service.stats?.rating || '4.9'}</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{service.stats?.clients || '50+'}</div>
                  <div className="text-sm text-gray-500">Clients</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiClock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{service.stats?.delivery_time || '2-4'}</div>
                  <div className="text-sm text-gray-500">Semaines</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{service.stats?.roi || '300%'}</div>
                  <div className="text-sm text-gray-500">ROI moyen</div>
                </div>
              </div>
            </motion.div>

            {/* Quote Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              id="quote"
              className="card bg-primary-dark text-white sticky top-24"
            >
              <h2 className="text-xl font-bold mb-4">Demander un devis</h2>
              <p className="text-white/80 mb-6">Remplissez le formulaire ci-dessous et nous vous contacterons sous 24h.</p>
              
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">
                    Nom complet <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={quoteForm.name}
                    onChange={handleQuoteChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                    Email <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={quoteForm.email}
                    onChange={handleQuoteChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={quoteForm.phone}
                    onChange={handleQuoteChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Votre numéro"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white/90 mb-1">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={quoteForm.company}
                    onChange={handleQuoteChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-white/90 mb-1">
                    Budget estimé
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={quoteForm.budget}
                    onChange={handleQuoteChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <option value="low">Moins de 1 000€</option>
                    <option value="medium">1 000€ - 5 000€</option>
                    <option value="high">5 000€ - 10 000€</option>
                    <option value="enterprise">Plus de 10 000€</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">
                    Message <span className="text-red-300">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={quoteForm.message}
                    onChange={handleQuoteChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Décrivez votre projet..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
                >
                  {submitting ? 'Envoi en cours...' : (
                    <>
                      <FiSend className="mr-2" />
                      Demander un devis gratuit
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}