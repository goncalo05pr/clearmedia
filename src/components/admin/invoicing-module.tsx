"use client";

import { useState, useEffect } from "react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  formationTitle: string;
  formationId: string;
  amount: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  notes?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

export default function InvoicingModule() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    clientId: "",
    formationTitle: "",
    formationId: "",
    amount: "",
    notes: ""
  });

  useEffect(() => {
    loadInvoicingData();
  }, []);

  const loadInvoicingData = async () => {
    try {
      const mockClients: Client[] = [
        {
          id: "1",
          name: "Sarah Martin",
          email: "sarah.martin@email.com",
          address: "123 Rue de la République, 75001 Paris"
        },
        {
          id: "2",
          name: "Marc Dubois",
          email: "marc.dubois@email.com",
          address: "456 Avenue des Champs-Élysées, 75008 Paris"
        }
      ];

      const mockInvoices: Invoice[] = [
        {
          id: "1",
          invoiceNumber: "INV-2024-001",
          clientId: "1",
          clientName: "Sarah Martin",
          clientEmail: "sarah.martin@email.com",
          clientAddress: "123 Rue de la République, 75001 Paris",
          formationTitle: "Social Ads Mastery",
          formationId: "social-ads-mastery",
          amount: 497,
          tax: 99.4, // 20% TVA
          total: 596.4,
          date: "2024-03-15",
          dueDate: "2024-04-15",
          status: "paid",
          paymentMethod: "Carte bancaire",
          paymentDate: "2024-03-15"
        },
        {
          id: "2",
          invoiceNumber: "INV-2024-002",
          clientId: "2",
          clientName: "Marc Dubois",
          clientEmail: "marc.dubois@email.com",
          clientAddress: "456 Avenue des Champs-Élysées, 75008 Paris",
          formationTitle: "Funnel Premium",
          formationId: "funnel-premium",
          amount: 997,
          tax: 199.4,
          total: 1196.4,
          date: "2024-03-14",
          dueDate: "2024-04-14",
          status: "sent"
        },
        {
          id: "3",
          invoiceNumber: "INV-2024-003",
          clientId: "1",
          clientName: "Sarah Martin",
          clientEmail: "sarah.martin@email.com",
          clientAddress: "123 Rue de la République, 75001 Paris",
          formationTitle: "Copy Closing",
          formationId: "copy-closing",
          amount: 397,
          tax: 79.4,
          total: 476.4,
          date: "2024-03-13",
          dueDate: "2024-04-13",
          status: "overdue"
        }
      ];

      setClients(mockClients);
      setInvoices(mockInvoices);
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoicing data:', error);
      setLoading(false);
    }
  };

  const generateInvoice = async () => {
    try {
      const client = clients.find(c => c.id === formData.clientId);
      if (!client) {
        alert('Veuillez sélectionner un client');
        return;
      }

      const amount = parseFloat(formData.amount);
      const tax = amount * 0.2; // 20% TVA
      const total = amount + tax;

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        clientId: formData.clientId,
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address,
        formationTitle: formData.formationTitle,
        formationId: formData.formationId,
        amount,
        tax,
        total,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        notes: formData.notes
      };

      console.log('Generating invoice:', newInvoice);
      setInvoices([...invoices, newInvoice]);
      
      setFormData({
        clientId: "",
        formationTitle: "",
        formationId: "",
        amount: "",
        notes: ""
      });
      setShowGenerateModal(false);
      
      // Générer le PDF
      generatePDF(newInvoice);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const generatePDF = (invoice: Invoice) => {
    // Simuler la génération de PDF
    // En production, utiliser une librairie comme jsPDF ou react-pdf
    const pdfContent = `
FACTURE N°${invoice.invoiceNumber}
Date: ${invoice.date}
Date d'échéance: ${invoice.dueDate}

CLIENT:
${invoice.clientName}
${invoice.clientAddress}
${invoice.clientEmail}

FORMATION: ${invoice.formationTitle}

Détails:
Montant HT: ${invoice.amount.toFixed(2)}€
TVA (20%): ${invoice.tax.toFixed(2)}€
Total TTC: ${invoice.total.toFixed(2)}€

Statut: ${invoice.status}
    `;

    // Créer un blob et télécharger
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${invoice.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      console.log('Updating invoice status:', invoiceId, newStatus);
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      ));
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const sendInvoice = async (invoice: Invoice) => {
    try {
      console.log('Sending invoice:', invoice.id);
      await handleStatusChange(invoice.id, 'sent');
      alert('Facture envoyée avec succès !');
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const filteredInvoices = selectedStatus === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  const paidRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">🧾 Facturation</h3>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Revenu Total</div>
          <div className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)}€</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">En Attente</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingRevenue.toFixed(2)}€</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Payé</div>
          <div className="text-2xl font-bold text-green-600">{paidRevenue.toFixed(2)}€</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Factures</div>
          <div className="text-2xl font-bold text-gray-900">{invoices.length}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Statut:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyées</option>
            <option value="paid">Payées</option>
            <option value="overdue">En retard</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowGenerateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Générer une facture
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.clientName}</div>
                      <div className="text-sm text-gray-600">{invoice.clientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.formationTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount.toFixed(2)}€</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{invoice.total.toFixed(2)}€</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status === 'draft' ? 'Brouillon' :
                       invoice.status === 'sent' ? 'Envoyée' :
                       invoice.status === 'paid' ? 'Payée' :
                       invoice.status === 'overdue' ? 'En retard' : 'Annulée'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => generatePDF(invoice)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        PDF
                      </button>
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => sendInvoice(invoice)}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Envoyer
                        </button>
                      )}
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value as Invoice['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="sent">Envoyée</option>
                        <option value="paid">Payée</option>
                        <option value="overdue">En retard</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Générer une facture</h4>
              <button 
                onClick={() => {
                  setShowGenerateModal(false);
                  setFormData({ clientId: "", formationTitle: "", formationId: "", amount: "", notes: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); generateInvoice(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                  <input
                    type="text"
                    required
                    value={formData.formationTitle}
                    onChange={(e) => setFormData({...formData, formationTitle: e.target.value})}
                    placeholder="ex: Social Ads Mastery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Formation</label>
                  <input
                    type="text"
                    required
                    value={formData.formationId}
                    onChange={(e) => setFormData({...formData, formationId: e.target.value})}
                    placeholder="ex: social-ads-mastery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  placeholder="Notes additionnelles..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-lg font-medium text-white hover:bg-green-700"
                >
                  Générer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Détails de la facture</h4>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">FACTURE</h2>
                <p className="text-lg text-gray-700">N° {selectedInvoice.invoiceNumber}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Client</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedInvoice.clientName}</div>
                    <div><span className="font-medium">Email:</span> {selectedInvoice.clientEmail}</div>
                    <div><span className="font-medium">Adresse:</span> {selectedInvoice.clientAddress}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <h5 className="font-semibold text-gray-900 mb-3">Informations</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Date:</span> {selectedInvoice.date}</div>
                    <div><span className="font-medium">Échéance:</span> {selectedInvoice.dueDate}</div>
                    <div><span className="font-medium">Statut:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status === 'draft' ? 'Brouillon' :
                         selectedInvoice.status === 'sent' ? 'Envoyée' :
                         selectedInvoice.status === 'paid' ? 'Payée' :
                         selectedInvoice.status === 'overdue' ? 'En retard' : 'Annulée'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-semibold text-gray-900 mb-3">Formation</h5>
                <p className="text-lg text-gray-900 mb-4">{selectedInvoice.formationTitle}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Montant HT:</span>
                    <span className="font-medium">{selectedInvoice.amount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%):</span>
                    <span className="font-medium">{selectedInvoice.tax.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC:</span>
                    <span>{selectedInvoice.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              
              {selectedInvoice.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Notes</h5>
                  <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => generatePDF(selectedInvoice)}
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-lg font-medium text-white hover:bg-green-700"
                >
                  📄 Télécharger PDF
                </button>
                {selectedInvoice.status === 'draft' && (
                  <button
                    onClick={() => sendInvoice(selectedInvoice)}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                  >
                    📧 Envoyer la facture
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
