'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, 
  FiPackage, FiDollarSign, FiClock, FiDownload, FiSave
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      const orderData = response.data.data;
      
      setOrder(orderData);
      setStatus(orderData.status);
      setTrackingNumber(orderData.tracking_number || '');
      setNotes(orderData.notes || '');
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Erreur lors du chargement de la commande');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      setSaving(true);
      await api.patch(`/orders/${orderId}`, {
        status,
        tracking_number: trackingNumber,
        notes
      });
      toast.success('Commande mise à jour avec succès');
      fetchOrder();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const downloadInvoice = () => {
    // In a real app, this would generate a PDF invoice
    toast.success('Téléchargement de la facture...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Commande introuvable</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Commande {order.order_number}
            </h1>
            <p className="text-gray-600 mt-1">
              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <button
          onClick={downloadInvoice}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Télécharger la facture
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles commandés</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FiPackage className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {item.price.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900">{order.subtotal?.toLocaleString('fr-FR') || order.total.toLocaleString('fr-FR')} €</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA</span>
                    <span className="text-gray-900">{order.tax.toLocaleString('fr-FR')} €</span>
                  </div>
                )}
                {order.shipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="text-gray-900">{order.shipping.toLocaleString('fr-FR')} €</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary">{order.total.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{order.user?.first_name} {order.user?.last_name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{order.user?.email}</span>
                  </div>
                  {order.user?.phone && (
                    <div className="flex items-center text-sm">
                      <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{order.user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Adresse de livraison</h3>
                <div className="flex items-start text-sm">
                  <FiMapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p>{order.shipping_address?.street || 'Non renseignée'}</p>
                    <p>{order.shipping_address?.city} {order.shipping_address?.postal_code}</p>
                    <p>{order.shipping_address?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut de la commande</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="pending">En attente</option>
                  <option value="processing">En cours</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de suivi
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: 1Z999AA10123456784"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes internes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Notes visibles uniquement par les admins..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                onClick={handleUpdateOrder}
                disabled={saving}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-4 h-4 mr-2" />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de paiement</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Méthode de paiement</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.payment_method === 'stripe' ? 'Carte bancaire (Stripe)' : 
                   order.payment_method === 'paypal' ? 'PayPal' : 
                   order.payment_method || 'Non spécifié'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut du paiement</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
              {order.payment_id && (
                <div>
                  <p className="text-sm text-gray-500">ID de transaction</p>
                  <p className="text-xs font-mono text-gray-900 break-all">{order.payment_id}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Commande créée</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {order.updated_at && order.updated_at !== order.created_at && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Dernière mise à jour</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.updated_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}