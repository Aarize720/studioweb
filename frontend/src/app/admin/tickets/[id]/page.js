'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend, FiUser, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id;

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${ticketId}`);
      const ticketData = response.data.data;
      
      setTicket(ticketData);
      setMessages(ticketData.messages || []);
      setStatus(ticketData.status);
      setPriority(ticketData.priority);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Erreur lors du chargement du ticket');
      router.push('/admin/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await api.post(`/tickets/${ticketId}/messages`, { message: newMessage });
      toast.success('Message envoyé');
      setNewMessage('');
      fetchTicket();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      await api.patch(`/tickets/${ticketId}`, { status, priority });
      toast.success('Ticket mis à jour');
      fetchTicket();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/tickets" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ticket?.subject}</h1>
          <p className="text-gray-600 mt-1">
            Créé le {new Date(ticket?.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">
                    {ticket?.user?.first_name} {ticket?.user?.last_name}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(ticket?.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
                <p className="text-gray-700">{ticket?.message}</p>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.is_admin ? 'bg-primary/10 ml-8' : 'bg-gray-50 mr-8'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">
                      {msg.is_admin ? 'Support' : `${ticket?.user?.first_name} ${ticket?.user?.last_name}`}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(msg.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="border-t pt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Votre réponse..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <FiSend className="w-4 h-4 mr-2" />
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="open">Ouvert</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <button
                onClick={handleUpdateTicket}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Nom:</span>{' '}
                <span className="font-medium">{ticket?.user?.first_name} {ticket?.user?.last_name}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Email:</span>{' '}
                <span className="font-medium">{ticket?.user?.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}