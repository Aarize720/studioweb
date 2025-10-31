'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheck, FiDownload, FiArrowLeft, FiClock, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.orders.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Erreur lors du chargement des détails de la commande');
      router.push('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-3/4"></div>
        <div className="card">
          <div className="skeleton h-64"></div>
        </div>
        <div className="card">
          <div className="skeleton h-48"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card text-center py-12">
        <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Commande introuvable
        </h3>
        <p className="text-gray-600 mb-6">
          Cette commande n'existe pas ou vous n'avez pas les droits pour y accéder.
        </p>
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="btn btn-primary"
        >
          Retour aux commandes
        </button>
      </div>
    );
  }

  // Statut de la commande avec étapes
  const statusSteps = [
    { key: 'pending', label: 'En attente', icon: FiClock },
    { key: 'processing', label: 'En traitement', icon: FiPackage },
    { key: 'shipped', label: 'Expédiée', icon: FiTruck },
    { key: 'delivered', label: 'Livrée', icon: FiCheck },
  ];

  // Trouver l'index du statut actuel
  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status);
  
  // Si la commande est annulée, on ne montre pas le stepper
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <button 
              onClick={() => router.push('/dashboard/orders')}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Commande #{order.id}</h1>
          </div>
          <p className="text-gray-600">Passée le {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`badge ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
          <button
            onClick={() => toast.success('Téléchargement de la facture...')}
            className="btn btn-outline flex items-center space-x-2"
          >
            <FiDownload />
            <span>Facture</span>
          </button>
        </div>
      </div>

      {/* Order Status Stepper */}
      {!isCancelled && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Suivi de commande</h2>
          
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2"
              style={{ 
                width: `${currentStatusIndex >= 0 
                  ? (currentStatusIndex / (statusSteps.length - 1)) * 100 
                  : 0}%` 
              }}
            ></div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const StepIcon = step.icon;
                
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                        ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-medium mt-2 text-center">
                      {step.label}
                    </div>
                    {order.status === step.key && (
                      <div className="text-xs text-primary mt-1">
                        {step.key === 'shipped' && order.tracking_number 
                          ? `Suivi: ${order.tracking_number}` 
                          : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking Information */}
          {order.tracking_number && order.status === 'shipped' && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <FiTruck className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800">Votre colis est en route</h3>
                  <p className="text-blue-600 mb-2">Numéro de suivi: {order.tracking_number}</p>
                  <a 
                    href={`https://tracking.example.com/${order.tracking_number}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-700 hover:text-blue-900"
                  >
                    Suivre mon colis →
                  </a>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Order Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Articles commandés</h2>
          
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiPackage className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.product?.name || 'Produit'}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.product?.description?.substring(0, 100) || 'Description non disponible'}
                    {item.product?.description?.length > 100 ? '...' : ''}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-primary font-bold">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Quantité: {item.quantity}
                  </div>
                  <div className="text-sm font-medium">
                    Total: {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 space-y-6"
        >
          {/* Payment Summary */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">{formatCurrency(order.shipping_cost || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="font-medium">{formatCurrency(order.tax || 0)}</span>
              </div>
              
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span>
                  <span className="font-medium">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <FiCreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">Paiement</h2>
            </div>
            
            <div className="text-gray-600">
              <p className="mb-1">
                <span className="font-medium">Méthode:</span>{' '}
                {order.payment_method === 'card' ? 'Carte bancaire' :
                 order.payment_method === 'paypal' ? 'PayPal' : 'Virement bancaire'}
              </p>
              <p className="mb-1">
                <span className="font-medium">Statut:</span>{' '}
                <span className="text-green-600 font-medium">Payé</span>
              </p>
              <p>
                <span className="font-medium">Date:</span>{' '}
                {formatDate(order.payment_date || order.created_at)}
              </p>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <FiMapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">Adresse de livraison</h2>
            </div>
            
            <div className="text-gray-600">
              {order.shipping_address && typeof order.shipping_address === 'object' ? (
                <>
                  <p className="mb-1">{order.shipping_address.address}</p>
                  <p className="mb-1">
                    {order.shipping_address.city}, {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </>
              ) : (
                <p>{order.shipping_address || 'Adresse non disponible'}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Historique de la commande</h2>
        
        <div className="space-y-4">
          {/* Simulate order history with created date and current status */}
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Commande créée</div>
              <div className="text-sm text-gray-600">{formatDate(order.created_at)}</div>
            </div>
          </div>
          
          {order.status !== 'pending' && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <FiPackage className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium">Commande en traitement</div>
                <div className="text-sm text-gray-600">
                  {formatDate(new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000))}
                </div>
              </div>
            </div>
          )}
          
          {(order.status === 'shipped' || order.status === 'delivered') && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <FiTruck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-medium">Commande expédiée</div>
                <div className="text-sm text-gray-600">
                  {formatDate(new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000))}
                </div>
                {order.tracking_number && (
                  <div className="text-sm text-indigo-600 mt-1">
                    Numéro de suivi: {order.tracking_number}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {order.status === 'delivered' && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Commande livrée</div>
                <div className="text-sm text-gray-600">
                  {formatDate(new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000))}
                </div>
              </div>
            </div>
          )}
          
          {order.status === 'cancelled' && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FiX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium">Commande annulée</div>
                <div className="text-sm text-gray-600">
                  {formatDate(order.updated_at || new Date())}
                </div>
                {order.cancellation_reason && (
                  <div className="text-sm text-red-600 mt-1">
                    Raison: {order.cancellation_reason}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}