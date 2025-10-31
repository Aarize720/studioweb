'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff,
  FiDownload, FiFilter, FiPackage
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter, stockFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: productsPerPage,
        search: searchTerm || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      };

      const response = await api.get('/products', { params });
      const data = response.data.data;
      
      let productsData = data.products || [];
      
      // Apply stock filter
      if (stockFilter === 'in_stock') {
        productsData = productsData.filter(p => p.stock > 0);
      } else if (stockFilter === 'out_of_stock') {
        productsData = productsData.filter(p => p.stock === 0);
      } else if (stockFilter === 'low_stock') {
        productsData = productsData.filter(p => p.stock > 0 && p.stock <= 10);
      }
      
      setProducts(productsData);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalProducts(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Produit supprimé avec succès');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleVisibility = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.patch(`/products/${productId}`, { status: newStatus });
      toast.success(`Produit ${newStatus === 'active' ? 'activé' : 'désactivé'}`);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Statut'];
    const rows = products.map(product => [
      product.id,
      product.name,
      product.category || '-',
      product.price,
      product.stock,
      product.status || 'active'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Export CSV réussi');
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rupture</span>;
    } else if (stock <= 10) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Stock faible</span>;
    } else {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">En stock</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des produits</h1>
          <p className="text-gray-600 mt-1">{totalProducts} produit(s) au total</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Tous les stocks</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStockFilter('all');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {(product.status === 'inactive' || product.stock === 0) && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {product.status === 'inactive' ? 'Inactif' : 'Rupture'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description || 'Aucune description'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">
                        {product.price.toLocaleString('fr-FR')} €
                      </span>
                      {getStockBadge(product.stock)}
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      Stock: <span className="font-medium">{product.stock}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                      >
                        <FiEdit className="w-4 h-4 mr-1" />
                        Éditer
                      </Link>
                      <button
                        onClick={() => handleToggleVisibility(product.id, product.status || 'active')}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title={(product.status || 'active') === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {(product.status || 'active') === 'active' ? (
                          <FiEye className="w-4 h-4 text-gray-600" />
                        ) : (
                          <FiEyeOff className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}