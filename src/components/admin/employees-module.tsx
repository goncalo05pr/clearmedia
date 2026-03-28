"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
      const supabase = createClient();
      
      // Récupérer les employés depuis Supabase
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('hire_date', { ascending: false });

      // Récupérer les départements depuis Supabase
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*');

      if (employeesError || departmentsError) {
        console.error('Error loading employees data:', { employeesError, departmentsError });
      } else {
        // Transformer les données brutes en format Employee
        const employeesList: Employee[] = (employeesData || []).map((emp: any) => ({
          id: emp.id,
          firstName: emp.first_name || '',
          lastName: emp.last_name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          role: emp.role || 'viewer',
          department: emp.department || '',
          hireDate: emp.hire_date || '',
          salary: emp.salary || 0,
          status: emp.status || 'active',
          avatar: emp.avatar_url || '',
          skills: emp.skills ? emp.skills.split(',').map((s: string) => s.trim()) : [],
          managerId: emp.manager_id
        }));

        // Transformer les données brutes en format Department
        const departmentsList: Department[] = (departmentsData || []).map((dept: any) => ({
          id: dept.id,
          name: dept.name || '',
          managerId: dept.manager_id || '',
          employeeCount: employeesList.filter(emp => emp.department === dept.name).length
        }));

        setEmployees(employeesList);
        setDepartments(departmentsList);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading employees data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (editingEmployee) {
        // Modifier un employé existant
        const { error } = await supabase
          .from('employees')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            department: formData.department,
            salary: parseFloat(formData.salary) || 0,
            skills: formData.skills,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEmployee.id);
          
        if (error) {
          console.error('Error updating employee:', error);
        } else {
          console.log('Employee updated successfully');
          await loadEmployeesData();
          setShowAddModal(false);
          setEditingEmployee(null);
        }
      } else {
        // Ajouter un nouvel employé
        const { error } = await supabase
          .from('employees')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            department: formData.department,
            salary: parseFloat(formData.salary) || 0,
            skills: formData.skills,
            status: 'active',
            hire_date: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error adding employee:', error);
        } else {
          console.log('Employee added successfully');
          await loadEmployeesData();
          setShowAddModal(false);
        }
      }
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "viewer",
        department: "",
        salary: "",
        skills: ""
      });
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
        const supabase = createClient();
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting employee:', error);
        } else {
          console.log('Employee deleted successfully');
          await loadEmployeesData();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Employee['status']) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('employees')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating employee status:', error);
      } else {
        console.log('Employee status updated successfully');
        await loadEmployeesData();
      }
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === selectedDepartment);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'support': return 'bg-yellow-100 text-yellow-800';
      case 'sales': return 'bg-orange-100 text-orange-800';
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
      <h3 className="text-xl font-semibold text-white mb-4">👥 Gestion des Employés</h3>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-white">Département:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg"
          >
            <option value="all">Tous les départements</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name} ({dept.employeeCount})
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter un employé
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900 mb-2">{employees.length}</div>
          <div className="text-sm text-gray-600">Total employés</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {employees.filter(emp => emp.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Employés actifs</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {employees.filter(emp => emp.status === 'on_leave').length}
          </div>
          <div className="text-sm text-gray-600">En congé</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-2">{departments.length}</div>
          <div className="text-sm text-gray-600">Départements</div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500 text-lg">Aucune donnée pour l'instant</p>
            <p className="text-gray-400 text-sm mt-2">
              {selectedDepartment === 'all' ? 'Aucun employé enregistré' : `Aucun employé dans le département ${selectedDepartment}`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.role)}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {employee.salary.toLocaleString()}€
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
                        <button
                          onClick={() => handleStatusChange(employee.id, employee.status === 'active' ? 'inactive' : 'active')}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                        >
                          {employee.status === 'active' ? 'Désactiver' : 'Activer'}
                        </button>
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
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingEmployee ? 'Modifier l\'employé' : 'Ajouter un employé'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEmployee(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="support">Support</option>
                    <option value="sales">Sales</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire</label>
                  <input
                    type="number"
                    required
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
                    placeholder="Compétence 1, Compétence 2, ..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEmployee(null);
                  }}
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
