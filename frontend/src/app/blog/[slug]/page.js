'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiUser, FiTag, FiShare2, FiMessageSquare, FiChevronRight, FiClock } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage({ params }) {
  const router = useRouter();
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    fetchPostDetails();
  }, [slug]);

  useEffect(() => {
    if (post?.content) {
      generateTableOfContents(post.content);
    }
  }, [post]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch by slug, but we're using ID here
      const response = await api.blog.getPostById(slug);
      setPost(response.data);
      
      // Simulate comments
      setComments(response.data.comments || []);
      
      // Fetch related posts
      if (response.data.category_id) {
        fetchRelatedPosts(response.data.category_id, response.data.id);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
      toast.error('Erreur lors du chargement de l\'article');
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (categoryId, postId) => {
    try {
      const response = await api.blog.getPosts({ 
        category_id: categoryId,
        exclude_id: postId,
        limit: 3
      });
      setRelatedPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const generateTableOfContents = (content) => {
    // This is a simple implementation - in a real app, you'd use a proper markdown/HTML parser
    const headings = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        headings.push({ id: `heading-${index}`, text: line.replace('# ', ''), level: 1 });
      } else if (line.startsWith('## ')) {
        headings.push({ id: `heading-${index}`, text: line.replace('## ', ''), level: 2 });
      } else if (line.startsWith('### ')) {
        headings.push({ id: `heading-${index}`, text: line.replace('### ', ''), level: 3 });
      }
    });
    
    setTableOfContents(headings);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Veuillez saisir un commentaire');
      return;
    }
    
    try {
      setSubmittingComment(true);
      
      // In a real app, you would send the comment to the API
      // For now, we'll just simulate it
      const newComment = {
        id: Date.now(),
        content: comment,
        author: 'Utilisateur',
        created_at: new Date().toISOString(),
        avatar: null
      };
      
      setComments(prev => [newComment, ...prev]);
      setComment('');
      
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmittingComment(false);
    }
  };

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post?.title || 'Article de blog';
    
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const renderContent = (content) => {
    if (!content) return null;
    
    // This is a simple implementation - in a real app, you'd use a proper markdown/HTML renderer
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 id={`heading-${index}`} key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-8">{line.replace('# ', '')}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 id={`heading-${index}`} key={index} className="text-2xl font-bold text-gray-900 mb-3 mt-6">{line.replace('## ', '')}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 id={`heading-${index}`} key={index} className="text-xl font-bold text-gray-900 mb-3 mt-5">{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2">{line.replace('- ', '')}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-4 text-gray-700">{line}</p>;
      }
    });
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const estimateReadingTime = (content) => {
    if (!content) return 0;
    
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Article introuvable
          </h3>
          <p className="text-gray-600 mb-6">
            Cet article n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => router.push('/blog')}
            className="btn btn-primary"
          >
            Voir tous les articles
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
              onClick={() => router.push('/blog')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white/80">Retour au blog</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {post.category?.name || 'Non catégorisé'}
              </span>
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {estimateReadingTime(post.content)} min de lecture
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>{post.author?.name || 'Admin'}</span>
              </div>
              
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                <span>{comments.length} commentaires</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Image */}
        {post.featured_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <article className="prose prose-lg max-w-none">
                {renderContent(post.content)}
              </article>
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2"
              >
                <FiTag className="text-gray-500" />
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                    onClick={() => router.push(`/blog?tag=${tag}`)}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Partager cet article</h3>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => sharePost('facebook')}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FaFacebookF />
                </button>
                
                <button 
                  onClick={() => sharePost('twitter')}
                  className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <FaTwitter />
                </button>
                
                <button 
                  onClick={() => sharePost('linkedin')}
                  className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedinIn />
                </button>
                
                <button 
                  onClick={() => sharePost('pinterest')}
                  className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <FaPinterestP />
                </button>
              </div>
            </motion.div>

            {/* Author */}
            {post.author && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {post.author.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                      {post.author.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h3>
                    <p className="text-gray-600 mb-3">{post.author.bio || 'Auteur chez Studio Web'}</p>
                    
                    {post.author.social && (
                      <div className="flex space-x-3">
                        {post.author.social.twitter && (
                          <a 
                            href={post.author.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-500"
                          >
                            <FaTwitter />
                          </a>
                        )}
                        
                        {post.author.social.linkedin && (
                          <a 
                            href={post.author.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-800"
                          >
                            <FaLinkedinIn />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Commentaires ({comments.length})</h3>
              
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Laissez un commentaire..."
                  rows={4}
                  className="input mb-3"
                  required
                ></textarea>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingComment}
                  >
                    {submittingComment ? 'Envoi en cours...' : 'Publier le commentaire'}
                  </button>
                </div>
              </form>
              
              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Soyez le premier à commenter cet article !
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={comment.id} className="flex space-x-4">
                      {comment.avatar ? (
                        <img 
                          src={comment.avatar} 
                          alt={comment.author}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {comment.author?.charAt(0) || 'U'}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                          <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                        </div>
                        
                        <p className="text-gray-700">{comment.content}</p>
                        
                        <button className="text-sm text-primary mt-2">Répondre</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card sticky top-24"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Table des matières</h3>
                
                <nav className="space-y-2">
                  {tableOfContents.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className={`block text-left w-full px-2 py-1 rounded hover:bg-gray-100 transition-colors
                        ${heading.level === 1 ? 'font-medium' : ''}
                        ${heading.level === 2 ? 'pl-4 text-sm' : ''}
                        ${heading.level === 3 ? 'pl-6 text-sm' : ''}
                      `}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Articles similaires</h3>
                  <button 
                    onClick={() => router.push('/blog')}
                    className="text-primary font-medium flex items-center text-sm"
                  >
                    Voir tous
                    <FiChevronRight className="ml-1" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div 
                      key={relatedPost.id}
                      className="flex space-x-3 cursor-pointer group"
                      onClick={() => router.push(`/blog/${relatedPost.id}`)}
                    >
                      {relatedPost.thumbnail ? (
                        <img 
                          src={relatedPost.thumbnail} 
                          alt={relatedPost.title}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 flex-shrink-0">
                          <FiUser />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatDate(relatedPost.published_at || relatedPost.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Catégories</h3>
              
              <div className="space-y-2">
                {['Développement Web', 'Design', 'Marketing', 'Technologie', 'Business'].map((category, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/blog?category=${category}`)}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-primary-dark text-white"
            >
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-white/80 mb-4">Recevez nos derniers articles et conseils directement dans votre boîte mail.</p>
              
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                
                <button
                  type="submit"
                  className="w-full btn bg-white text-primary hover:bg-gray-100"
                >
                  S'abonner
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}