"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // en minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'call_client' | 'reunion_interne' | 'consultation' | 'demo' | 'support';
  meetingLink?: string;
  notes?: string;
  clientId?: string;
  clientName?: string;
}

interface CalendarDay {
  date: string;
  appointments: Appointment[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function CalendarModule() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    duration: 60,
    type: "consultation" as Appointment['type'],
    meetingLink: "",
    notes: "",
    clientName: ""
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les rendez-vous depuis Supabase
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error loading appointments:', error);
      } else {
        // Transformer les données brutes en format Appointment
        const appointmentsList: Appointment[] = (data || []).map((apt: any) => ({
          id: apt.id,
          title: apt.title || '',
          description: apt.description || '',
          date: apt.date || '',
          time: apt.time || '',
          duration: apt.duration || 60,
          status: apt.status || 'scheduled',
          type: apt.type || 'consultation',
          meetingLink: apt.meeting_link || '',
          notes: apt.notes || '',
          clientId: apt.client_id,
          clientName: apt.client_name
        }));

        setAppointments(appointmentsList);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAddModal(true);
    setFormData({
      title: "",
      description: "",
      time: "09:00",
      duration: 60,
      type: "consultation",
      meetingLink: "",
      notes: "",
      clientName: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) return;
    
    try {
      const supabase = createClient();
      
      const appointmentData = {
        title: formData.title,
        description: formData.description,
        date: selectedDate.toISOString().split('T')[0],
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        meeting_link: formData.meetingLink,
        notes: formData.notes,
        client_name: formData.clientName,
        status: 'scheduled',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (error) {
        console.error('Error creating appointment:', error);
      } else {
        console.log('Appointment created successfully');
        await loadAppointments();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting appointment:', error);
        } else {
          console.log('Appointment deleted successfully');
          await loadAppointments();
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: date.toISOString().split('T')[0],
        appointments: appointments.filter(apt => apt.date === date.toISOString().split('T')[0]),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add days of current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        appointments: appointments.filter(apt => apt.date === dateStr),
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date: date.toISOString().split('T')[0],
        appointments: appointments.filter(apt => apt.date === date.toISOString().split('T')[0]),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call_client': return 'bg-blue-100 text-blue-800';
      case 'reunion_interne': return 'bg-purple-100 text-purple-800';
      case 'consultation': return 'bg-green-100 text-green-800';
      case 'demo': return 'bg-orange-100 text-orange-800';
      case 'support': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'call_client': return 'Call client';
      case 'reunion_interne': return 'Réunion interne';
      case 'consultation': return 'Consultation';
      case 'demo': return 'Demo';
      case 'support': return 'Support';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">📅 Calendrier</h3>
      
      {/* Calendar Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h4 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h4>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>
          
          <div className="flex space-x-2">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour'}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
          
          {getDaysInMonth(currentDate).map((day, index) => (
            <div
              key={index}
              onClick={() => day.isCurrentMonth && handleDateClick(new Date(day.date))}
              className={`min-h-24 p-2 border border-gray-200 cursor-pointer transition-colors ${
                day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              } ${day.isToday ? 'bg-blue-50 border-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium ${
                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${day.isToday ? 'text-blue-600' : ''}`}>
                {new Date(day.date).getDate()}
              </div>
              
              {day.appointments.length > 0 && (
                <div className="mt-1 space-y-1">
                  {day.appointments.slice(0, 2).map((apt, aptIndex) => (
                    <div
                      key={aptIndex}
                      className={`text-xs p-1 rounded truncate ${getTypeColor(apt.type)}`}
                      title={`${apt.title} - ${apt.time}`}
                    >
                      {apt.time} {apt.title}
                    </div>
                  ))}
                  {day.appointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{day.appointments.length - 2} plus
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Rendez-vous à venir</h4>
        </div>
        
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-500 text-lg">Aucun rendez-vous pour l'instant</p>
              <p className="text-gray-400 text-sm mt-2">Cliquez sur une date pour ajouter un rendez-vous</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter(apt => new Date(apt.date + ' ' + apt.time) >= new Date())
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .slice(0, 10)
                .map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                            {getTypeLabel(appointment.type)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'scheduled' ? 'Planifié' : 
                             appointment.status === 'completed' ? 'Terminé' : 
                             appointment.status === 'cancelled' ? 'Annulé' : 'Absent'}
                          </span>
                        </div>
                        
                        <h5 className="font-semibold text-gray-900 mb-1">{appointment.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                          <span>🕐 {appointment.time}</span>
                          <span>⏱️ {appointment.duration} min</span>
                        </div>
                        
                        {appointment.clientName && (
                          <div className="text-sm text-gray-500 mt-1">
                            👤 {appointment.clientName}
                          </div>
                        )}
                        
                        {appointment.meetingLink && (
                          <div className="text-sm text-blue-600 mt-1">
                            🔗 <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">Lien de réunion</a>
                          </div>
                        )}
                        
                        {appointment.notes && (
                          <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                            📝 {appointment.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Ajouter un rendez-vous - {selectedDate.toLocaleDateString('fr-FR')}
              </h4>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={30}>30 min</option>
                    <option value={60}>1 heure</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2 heures</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="call_client">Call client</option>
                  <option value="reunion_interne">Réunion interne</option>
                  <option value="demo">Demo</option>
                  <option value="support">Support</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client (optionnel)</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du client"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien de réunion (optionnel)</label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Détails du rendez-vous</h4>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-900 mb-1">Titre</div>
                <div className="text-gray-700">{selectedAppointment.title}</div>
              </div>
              
              <div>
                <div className="font-medium text-gray-900 mb-1">Description</div>
                <div className="text-gray-700">{selectedAppointment.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Date</div>
                  <div className="text-gray-700">{new Date(selectedAppointment.date).toLocaleDateString('fr-FR')}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Heure</div>
                  <div className="text-gray-700">{selectedAppointment.time}</div>
                </div>
              </div>
              
              <div>
                <div className="font-medium text-gray-900 mb-1">Type</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedAppointment.type)}`}>
                  {getTypeLabel(selectedAppointment.type)}
                </span>
              </div>
              
              <div>
                <div className="font-medium text-gray-900 mb-1">Statut</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status === 'scheduled' ? 'Planifié' : 
                   selectedAppointment.status === 'completed' ? 'Terminé' : 
                   selectedAppointment.status === 'cancelled' ? 'Annulé' : 'Absent'}
                </span>
              </div>
              
              {selectedAppointment.clientName && (
                <div>
                  <div className="font-medium text-gray-900 mb-1">Client</div>
                  <div className="text-gray-700">{selectedAppointment.clientName}</div>
                </div>
              )}
              
              {selectedAppointment.meetingLink && (
                <div>
                  <div className="font-medium text-gray-900 mb-1">Lien de réunion</div>
                  <a href={selectedAppointment.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {selectedAppointment.meetingLink}
                  </a>
                </div>
              )}
              
              {selectedAppointment.notes && (
                <div>
                  <div className="font-medium text-gray-900 mb-1">Notes</div>
                  <div className="text-gray-700">{selectedAppointment.notes}</div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => handleDelete(selectedAppointment.id)}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-lg font-medium text-white hover:bg-red-700"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
