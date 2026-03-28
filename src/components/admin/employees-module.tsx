"use client";

import { useState, useEffect } from "react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer' | 'support' | 'sales';
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
  skills: string[];
  managerId?: string;
}

interface Department {
  id: string;
  name: string;
  managerId: string;
  employeeCount: number;
}

export default function EmployeesModule() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "viewer" as Employee['role'],
    department: "",
    salary: "",
    skills: ""
  });

  useEffect(() => {
    loadEmployeesData();
  }, []);

  const loadEmployeesData = async () => {
    try {
      const mockEmployees: Employee[] = [
        {
          id: "1",
          firstName: "Alice",
          lastName: "Martin",
          email: "alice.martin@kliqz.com",
          phone: "06 12 34 56 78",
          role: "admin",
          department: "Direction",
          hireDate: "2023-01-15",
          salary: 65000,
          status: "active",
          avatar: "👩‍💼",
          skills: ["Management", "Strategy", "Leadership"]
        },
        {
          id: "2",
          firstName: "Bernard",
          lastName: "Dubois",
          email: "bernard.dubois@kliqz.com",
          phone: "06 23 45 67 89",
          role: "manager",
          department: "Marketing",
          hireDate: "2023-03-20",
          salary: 48000,
          status: "active",
          avatar: "👨‍💼",
          skills: ["Marketing", "Team Management", "Analytics"]
        },
        {
          id: "3",
          firstName: "Claire",
          lastName: "Petit",
          email: "claire.petit@kliqz.com",
          phone: "06 34 56 78 90",
          role: "editor",
          department: "Contenu",
          hireDate: "2023-06-10",
          salary: 42000,
          status: "active",
          avatar: "👩‍💼",
          skills: ["Content Creation", "Copywriting", "SEO"]
        },
        {
          id: "4",
          firstName: "David",
          lastName: "Bernard",
          email: "david.bernard@kliqz.com",
          phone: "06 45 67 89 01",
          role: "support",
          department: "Support Client",
          hireDate: "2023-09-05",
          salary: 35000,
          status: "on_leave",
          avatar: "👨‍💼",
          skills: ["Customer Service", "Problem Solving", "Communication"]
        },
        {
          id: "5",
          firstName: "Emma",
          lastName: "Lefevre",
          email: "emma.lefevre@kliqz.com",
          phone: "06 56 78 90 12",
          role: "sales",
          department: "Ventes",
          hireDate: "2023-11-12",
          salary: 38000,
          status: "active",
          avatar: "👩‍💼",
          skills: ["Sales", "Negotiation", "CRM"]
        }
      ];

      const mockDepartments: Department[] = [
        { id: "direction", name: "Direction", managerId: "1", employeeCount: 1 },
        { id: "marketing", name: "Marketing", managerId: "2", employeeCount: 1 },
        { id: "contenu", name: "Contenu", managerId: "3", employeeCount: 1 },
        { id: "support", name: "Support Client", managerId: "4", employeeCount: 1 },
        { id: "ventes", name: "Ventes", managerId: "5", employeeCount: 1 }
      ];

      setEmployees(mockEmployees);
      setDepartments(mockDepartments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading employees data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        // Logique de modification
        console.log('Updating employee:', editingEmployee.id, formData);
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id 
            ? { 
                ...emp, 
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                department: formData.department,
                salary: parseFloat(formData.salary),
                skills: formData.skills.split(',').map(s => s.trim())
              }
            : emp
        ));
        setEditingEmployee(null);
      } else {
        // Logique d'ajout
        console.log('Adding employee:', formData);
        const newEmployee: Employee = {
          id: Date.now().toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
          hireDate: new Date().toISOString().split('T')[0],
          salary: parseFloat(formData.salary),
          status: 'active',
          avatar: "👤",
          skills: formData.skills.split(',').map(s => s.trim())
        };
        setEmployees([...employees, newEmployee]);
      }
      
      setFormData({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        role: "viewer" as Employee['role'], 
        department: "", 
        salary: "", 
        skills: "" 
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
      salary: employee.salary.toString(),
      skills: employee.skills.join(', ')
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        console.log('Deleting employee:', id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Employee['status']) => {
    try {
      console.log('Changing employee status:', id, newStatus);
      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, status: newStatus } : emp
      ));
    } catch (error) {
      console.error('Error changing employee status:', error);
    }
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === selectedDepartment);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'sales': return 'bg-yellow-100 text-yellow-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">👥 Gestion des Employés</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter un employé
        </button>
      </div>

      {/* Department Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Département:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                <p className="text-sm text-gray-600">{dept.employeeCount} employé(s)</p>
              </div>
              <div className="text-2xl">🏢</div>
            </div>
          </div>
        ))}
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{employee.avatar}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Embauché le {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.role)}`}>
                      {employee.role === 'admin' ? 'Admin' :
                       employee.role === 'manager' ? 'Manager' :
                       employee.role === 'editor' ? 'Éditeur' :
                       employee.role === 'support' ? 'Support' :
                       employee.role === 'sales' ? 'Ventes' : 'Lecteur'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {employee.salary.toLocaleString()}€/an
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status === 'active' ? 'Actif' :
                       employee.status === 'inactive' ? 'Inactif' : 'En congé'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Modifier
                      </button>
                      <select
                        value={employee.status}
                        onChange={(e) => handleStatusChange(employee.id, e.target.value as Employee['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="on_leave">Congé</option>
                      </select>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingEmployee ? 'Modifier l\'employé' : 'Ajouter un employé'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEmployee(null);
                  setFormData({ 
                    firstName: "", 
                    lastName: "", 
                    email: "", 
                    phone: "", 
                    role: "viewer" as Employee['role'], 
                    department: "", 
                    salary: "", 
                    skills: "" 
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="ex: Marketing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as Employee['role']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="viewer">Lecteur</option>
                    <option value="support">Support</option>
                    <option value="sales">Ventes</option>
                    <option value="editor">Éditeur</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire annuel (€)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="séparées par des virgules"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingEmployee ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
