'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function PortfolioPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await api.portfolio.getAll(params);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Tous les projets' },
    { id: 'web', name: 'Sites Web' },
    { id: 'mobile', name: 'Applications Mobiles' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'design', name: 'Design' },
    { id: 'other', name: 'Autres' }
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-5xl font-bold mb-6">Notre Portfolio</h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez nos réalisations et projets qui ont fait la différence
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
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

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton aspect-video mb-4"></div>
                  <div className="skeleton h-6 w-3/4 mb-2"></div>
                  <div className="skeleton h-4 w-full mb-4"></div>
                  <div className="skeleton h-10 w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? 'Aucun projet trouvé pour cette recherche'
                  : 'Aucun projet trouvé dans cette catégorie'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => router.push(`/portfolio/${project.id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={project.image_url || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                        {project.live_url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.live_url, '_blank');
                            }}
                            className="flex-1 btn btn-sm bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center space-x-1"
                          >
                            <FiExternalLink className="w-4 h-4" />
                            <span>Voir</span>
                          </button>
                        )}
                        {project.github_url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.github_url, '_blank');
                            }}
                            className="flex-1 btn btn-sm bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center space-x-1"
                          >
                            <FiGithub className="w-4 h-4" />
                            <span>Code</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    {/* Category Badge */}
                    <span className="badge badge-primary">
                      {project.category || 'Web'}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Client */}
                    {project.client_name && (
                      <p className="text-sm text-gray-500">
                        Client: <span className="font-medium">{project.client_name}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-gray-600">Projets réalisés</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Technologies maîtrisées</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Support disponible</div>
            </motion.div>
          </div>
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
              Prêt à lancer votre projet ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Discutons de vos besoins et créons ensemble quelque chose d'exceptionnel
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="btn bg-white text-primary hover:bg-gray-100"
            >
              Démarrer un projet
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}