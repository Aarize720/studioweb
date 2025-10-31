'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiMail, FiCreditCard, FiGlobe, FiTool } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    site_name: 'Horizon Studio',
    site_description: 'Creative Code, Clear Results',
    contact_email: 'contact@horizonstudio.com',
    support_email: 'support@horizonstudio.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Tech, 75001 Paris',
    stripe_enabled: true,
    paypal_enabled: true,
    maintenance_mode: false,
    meta_title: 'Horizon Studio - Creative Code, Clear Results',
    meta_description: 'Agence de développement web et mobile',
    meta_keywords: 'développement web, mobile, design'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real app, this would save to the backend
      // await api.put('/settings', settings);
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: FiGlobe },
    { id: 'email', name: 'Email', icon: FiMail },
    { id: 'payment', name: 'Paiements', icon: FiCreditCard },
    { id: 'seo', name: 'SEO', icon: FiGlobe },
    { id: 'advanced', name: 'Avancé', icon: FiTool }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du site</h1>
          <p className="text-gray-600 mt-1">Gérer la configuration de votre site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <FiSave className="w-4 h-4 mr-2" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={settings.site_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="site_description"
                    value={settings.site_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration email</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={settings.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de support
                  </label>
                  <input
                    type="email"
                    name="support_email"
                    value={settings.support_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Méthodes de paiement</h2>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Stripe</h3>
                    <p className="text-sm text-gray-500">Accepter les paiements par carte bancaire</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="stripe_enabled"
                      checked={settings.stripe_enabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">PayPal</h3>
                    <p className="text-sm text-gray-500">Accepter les paiements PayPal</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="paypal_enabled"
                      checked={settings.paypal_enabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO & Métadonnées</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    value={settings.meta_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description SEO
                  </label>
                  <textarea
                    name="meta_description"
                    value={settings.meta_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mots-clés
                  </label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={settings.meta_keywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres avancés</h2>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Mode maintenance</h3>
                    <p className="text-sm text-gray-500">Désactiver temporairement le site pour les visiteurs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                {settings.maintenance_mode && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Le mode maintenance est activé. Seuls les administrateurs peuvent accéder au site.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}