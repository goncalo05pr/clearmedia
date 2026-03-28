"use client";

import { useState, useEffect } from "react";

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // en minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'followup' | 'demo' | 'support';
  meetingLink?: string;
  notes?: string;
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

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          clientId: "1",
          clientName: "Sarah Martin",
          clientEmail: "sarah.martin@email.com",
          title: "Consultation Marketing",
          description: "Première consultation pour discuter des besoins en formation",
          date: "2024-03-20",
          time: "14:00",
          duration: 60,
          status: "scheduled",
          type: "consultation",
          meetingLink: "https://meet.jit.si/kliqz-sarah-martin"
        },
        {
          id: "2",
          clientId: "2",
          clientName: "Marc Dubois",
          clientEmail: "marc.dubois@email.com",
          title: "Suivi Formation",
          description: "Point sur l'avancement dans la formation Social Ads",
          date: "2024-03-21",
          time: "10:00",
          duration: 30,
          status: "scheduled",
          type: "followup",
          meetingLink: "https://meet.jit.si/kliqz-marc-dubois"
        },
        {
          id: "3",
          clientId: "3",
          clientName: "Julie Petit",
          clientEmail: "julie.petit@email.com",
          title: "Démo Plateforme",
          description: "Présentation des fonctionnalités avancées",
          date: "2024-03-22",
          time: "15:30",
          duration: 45,
          status: "scheduled",
          type: "demo",
          meetingLink: "https://meet.jit.si/kliqz-julie-petit"
        }
      ];

      setAppointments(mockAppointments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setLoading(false);
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

    // Ajouter les jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      days.push({
        date: prevMonthDay.toISOString().split('T')[0],
        appointments: [],
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const dateStr = currentDay.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(apt => apt.date === dateStr);

      days.push({
        date: dateStr,
        appointments: dayAppointments,
        isCurrentMonth: true,
        isToday: currentDay.toDateString() === new Date().toDateString()
      });
    }

    // Ajouter les jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonthDay = new Date(year, month + 1, day);
      days.push({
        date: nextMonthDay.toISOString().split('T')[0],
        appointments: [],
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      console.log('Updating appointment status:', appointmentId, newStatus);
      // En production: await supabase.from('appointments').update({ status: newStatus }).eq('id', appointmentId);
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const generateMeetingLink = (appointment: Appointment) => {
    const link = `https://meet.jit.si/kliqz-${appointment.clientName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    return link;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'followup': return 'bg-indigo-100 text-indigo-800';
      case 'demo': return 'bg-pink-100 text-pink-800';
      case 'support': return 'bg-orange-100 text-orange-800';
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

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">📅 Calendrier & Rendez-vous</h3>
      
      {/* View Mode Selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Vue:</label>
          <div className="flex space-x-2">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <h4 className="text-lg font-semibold text-gray-900">{monthYear}</h4>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'month' && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  onClick={() => day.isCurrentMonth && setSelectedDate(new Date(day.date))}
                  className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-colors ${
                    day.isCurrentMonth 
                      ? 'bg-white hover:bg-gray-50 border-gray-200' 
                      : 'bg-gray-50 text-gray-400 border-gray-100'
                  } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="text-sm font-medium mb-1">
                    {new Date(day.date).getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.appointments.slice(0, 2).map((apt, i) => (
                      <div
                        key={i}
                        className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                        title={apt.title}
                      >
                        {apt.time} - {apt.title}
                      </div>
                    ))}
                    {day.appointments.length > 2 && (
                      <div className="text-xs text-gray-600">
                        +{day.appointments.length - 2} plus
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Rendez-vous à venir</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments
                .filter(apt => apt.status === 'scheduled')
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.time}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{appointment.clientName}</div>
                        <div className="text-sm text-gray-600">{appointment.clientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type === 'consultation' ? 'Consultation' :
                         appointment.type === 'followup' ? 'Suivi' :
                         appointment.type === 'demo' ? 'Démo' : 'Support'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'scheduled' ? 'Planifié' :
                         appointment.status === 'completed' ? 'Terminé' :
                         appointment.status === 'cancelled' ? 'Annulé' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {appointment.meetingLink && (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Rejoindre
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Détails
                        </button>
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="scheduled">Planifié</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                          <option value="no-show">Absent</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Informations</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Date:</span> {new Date(selectedAppointment.date).toLocaleDateString('fr-FR')}</div>
                    <div><span className="font-medium">Heure:</span> {selectedAppointment.time}</div>
                    <div><span className="font-medium">Durée:</span> {selectedAppointment.duration} minutes</div>
                    <div><span className="font-medium">Type:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedAppointment.type)}`}>
                        {selectedAppointment.type === 'consultation' ? 'Consultation' :
                         selectedAppointment.type === 'followup' ? 'Suivi' :
                         selectedAppointment.type === 'demo' ? 'Démo' : 'Support'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Client</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedAppointment.clientName}</div>
                    <div><span className="font-medium">Email:</span> {selectedAppointment.clientEmail}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Description</h5>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                  {selectedAppointment.description}
                </div>
              </div>
              
              {selectedAppointment.meetingLink && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Lien de réunion</h5>
                  <a
                    href={selectedAppointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {selectedAppointment.meetingLink}
                  </a>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedAppointment.meetingLink && (
                  <a
                    href={selectedAppointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                  >
                    Rejoindre la réunion
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
