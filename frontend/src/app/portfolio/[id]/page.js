'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiCalendar, FiTag, FiUser, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function PortfolioDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await api.portfolio.getById(id);
      setProject(response.data);
      
      // Fetch related projects
      if (response.data.category) {
        fetchRelatedProjects(response.data.category, response.data.id);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast.error('Erreur lors du chargement des détails du projet');
      router.push('/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProjects = async (category, projectId) => {
    try {
      const response = await api.portfolio.getAll({ 
        category,
        exclude_id: projectId,
        limit: 3
      });
      setRelatedProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching related projects:', error);
    }
  };

  const nextImage = () => {
    if (project?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="skeleton h-10 w-3/4"></div>
        <div className="skeleton h-64"></div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 skeleton h-96"></div>
          <div className="skeleton h-96"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Projet introuvable
          </h3>
          <p className="text-gray-600 mb-6">
            Ce projet n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => router.push('/portfolio')}
            className="btn btn-primary"
          >
            Voir tous les projets
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
              onClick={() => router.push('/portfolio')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white/80">Retour au portfolio</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-white/90 mb-8">{project.short_description}</p>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center text-white/80">
                <FiCalendar className="mr-2" />
                <span>{formatDate(project.completed_date || project.created_at)}</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <FiTag className="mr-2" />
                <span>{project.category}</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <FiUser className="mr-2" />
                <span>{project.client}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Main Image Slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-lg overflow-hidden"
            >
              {project.images && project.images.length > 0 ? (
                <>
                  <div 
                    className="aspect-video bg-gray-200 cursor-pointer"
                    onClick={() => openLightbox(currentImageIndex)}
                  >
                    <img 
                      src={project.images[currentImageIndex]} 
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {project.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <FiChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <FiChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </>
              ) : project.thumbnail ? (
                <div className="aspect-video bg-gray-200">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-400">
                  Aucune image disponible
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {project.images && project.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-5 gap-2"
              >
                {project.images.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${project.title} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos du projet</h2>
              
              <div className="prose prose-lg max-w-none">
                {project.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {project.challenge && (
                  <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Le défi</h2>
                    <p className="text-gray-600">{project.challenge}</p>
                  </div>
                )}
                
                {project.solution && (
                  <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Notre solution</h2>
                    <p className="text-gray-600">{project.solution}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {project.results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card bg-green-50 border border-green-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Résultats</h2>
                <p className="text-gray-600">{project.results}</p>
                
                {project.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {project.stats.map((stat, index) => (
                      <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Testimonial */}
            {project.testimonial && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card bg-blue-50 border border-blue-100"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {project.testimonial.avatar && (
                    <img 
                      src={project.testimonial.avatar} 
                      alt={project.testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  
                  <div>
                    <blockquote className="text-lg italic text-gray-700 mb-4">
                      "{project.testimonial.content}"
                    </blockquote>
                    
                    <div>
                      <div className="font-semibold text-gray-900">{project.testimonial.name}</div>
                      <div className="text-sm text-gray-500">{project.testimonial.position}, {project.testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client</h3>
                  <p className="font-medium text-gray-900">{project.client}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                  <p className="font-medium text-gray-900">{project.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de réalisation</h3>
                  <p className="font-medium text-gray-900">{formatDate(project.completed_date || project.created_at)}</p>
                </div>
                
                {project.duration && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durée du projet</h3>
                    <p className="font-medium text-gray-900">{project.duration}</p>
                  </div>
                )}
                
                {project.website_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Site web</h3>
                    <a 
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-primary-dark flex items-center"
                    >
                      Visiter le site
                      <FiExternalLink className="ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Technologies</h2>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Services */}
            {project.services && project.services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services fournis</h2>
                
                <ul className="space-y-2">
                  {project.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-primary-dark text-white"
            >
              <h2 className="text-xl font-bold mb-4">Intéressé par un projet similaire ?</h2>
              <p className="text-white/80 mb-6">Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full btn bg-white text-primary hover:bg-gray-100"
                >
                  Nous contacter
                </button>
                
                <button
                  onClick={() => router.push('/services')}
                  className="w-full btn btn-outline border-white text-white hover:bg-white/10"
                >
                  Voir nos services
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Projets similaires</h2>
              <button 
                onClick={() => router.push('/portfolio')}
                className="text-primary font-medium flex items-center"
              >
                Voir tous
                <FiChevronRight className="ml-1" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((project) => (
                <div 
                  key={project.id}
                  className="card p-0 overflow-hidden group cursor-pointer"
                  onClick={() => router.push(`/portfolio/${project.id}`)}
                >
                  <div className="aspect-video overflow-hidden">
                    {project.thumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.short_description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{project.category}</span>
                      <span className="text-primary font-medium">Voir le projet</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && project.images && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <FiChevronLeft className="w-10 h-10" />
          </button>
          
          <img 
            src={project.images[currentImageIndex]} 
            alt={`${project.title} - Image ${currentImageIndex + 1}`}
            className="max-w-[90%] max-h-[90vh] object-contain"
          />
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <FiChevronRight className="w-10 h-10" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </div>
  );
}