"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export function AccountingModule() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [activeTab, setActiveTab] = useState<"accounting" | "hr">("accounting");

  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    description: '',
    amount: 0,
    date: ''
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: 0,
    hire_date: '',
    status: 'active' as 'active' | 'inactive' | 'on_leave'
  });

  useEffect(() => {
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    try {
      const supabase = createClient();
      
      const { data: transactionsData } = await supabase.from("transactions").select("*");
      const { data: employeesData } = await supabase.from("employees").select("*");
      
      if (transactionsData) setTransactions(transactionsData);
      if (employeesData) setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching accounting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("transactions").insert([newTransaction]).select();
      if (data) {
        setTransactions([...transactions, data[0]]);
        setShowAddTransaction(false);
        setNewTransaction({
          type: 'income',
          category: '',
          description: '',
          amount: 0,
          date: ''
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const addEmployee = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("employees").insert([newEmployee]).select();
      if (data) {
        setEmployees([...employees, data[0]]);
        setShowAddEmployee(false);
        setNewEmployee({
          name: '',
          email: '',
          position: '',
          department: '',
          salary: 0,
          hire_date: '',
          status: 'active'
        });
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const calculateBalance = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return income - expenses;
  };

  const calculateMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateTotalSalaries = () => {
    return employees
      .filter(e => e.status === 'active')
      .reduce((sum, e) => sum + e.salary, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex gap-2 glass-strong rounded-2xl p-2">
        <button
          onClick={() => setActiveTab("accounting")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "accounting"
              ? "btn-gradient text-white"
              : "text-neutral-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          💰 Comptabilité
        </button>
        <button
          onClick={() => setActiveTab("hr")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "hr"
              ? "btn-gradient text-white"
              : "text-neutral-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          👥 RH
        </button>
      </div>

      {/* Accounting Tab */}
      {activeTab === "accounting" && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                💰
              </div>
              <div className="text-2xl font-black text-white">
                {calculateBalance().toLocaleString()}€
              </div>
              <div className="text-sm text-neutral-300">Solde Actuel</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
                📈
              </div>
              <div className="text-2xl font-black text-white">
                {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}€
              </div>
              <div className="text-sm text-neutral-300">Revenus Totaux</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
                📉
              </div>
              <div className="text-2xl font-black text-white">
                {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}€
              </div>
              <div className="text-sm text-neutral-300">Dépenses Totales</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
                📅
              </div>
              <div className="text-2xl font-black text-white">
                {calculateMonthlyExpenses().toLocaleString()}€
              </div>
              <div className="text-sm text-neutral-300">Dépenses Mensuelles</div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowAddTransaction(true)}
            className="btn-gradient px-6 py-3 rounded-xl font-bold text-white hover:scale-105"
          >
            ➕ Ajouter une transaction
          </button>

          {/* Transactions Table */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">💰 Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white font-bold">Date</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Description</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Catégorie</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Type</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Montant</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-neutral-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white">{transaction.description}</td>
                      <td className="py-3 px-4 text-neutral-300">{transaction.category}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          transaction.type === 'income' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {transaction.type === 'income' ? '📈 Revenu' : '📉 Dépense'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-lg font-bold">
                        <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()}€
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20">
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* HR Tab */}
      {activeTab === "hr" && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                👥
              </div>
              <div className="text-2xl font-black text-white">{employees.length}</div>
              <div className="text-sm text-neutral-300">Total Employés</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
                ✅
              </div>
              <div className="text-2xl font-black text-white">
                {employees.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-neutral-300">Employés Actifs</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
                💰
              </div>
              <div className="text-2xl font-black text-white">
                {calculateTotalSalaries().toLocaleString()}€
              </div>
              <div className="text-sm text-neutral-300">Masse Salariale</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
                🏖️
              </div>
              <div className="text-2xl font-black text-white">
                {employees.filter(e => e.status === 'on_leave').length}
              </div>
              <div className="text-sm text-neutral-300">En Congé</div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowAddEmployee(true)}
            className="btn-gradient px-6 py-3 rounded-xl font-bold text-white hover:scale-105"
          >
            ➕ Ajouter un employé
          </button>

          {/* Employees Table */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">👥 Gestion des Employés</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white font-bold">Nom</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Email</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Poste</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Département</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Salaire</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold text-white">{employee.name}</td>
                      <td className="py-3 px-4 text-neutral-300">{employee.email}</td>
                      <td className="py-3 px-4 text-neutral-300">{employee.position}</td>
                      <td className="py-3 px-4 text-neutral-300">{employee.department}</td>
                      <td className="py-3 px-4 text-lg font-bold text-[#8B5CF6]">
                        {employee.salary.toLocaleString()}€
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          employee.status === 'active' ? 'bg-green-500/20 text-green-300' :
                          employee.status === 'on_leave' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {employee.status === 'active' ? '✅ Actif' :
                           employee.status === 'on_leave' ? '🏖️ Congé' : '💤 Inactif'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20">
                            ✏️
                          </button>
                          <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">💰 Ajouter une Transaction</h3>
            <div className="space-y-4">
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as Transaction['type']})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              >
                <option value="income">📈 Revenu</option>
                <option value="expense">📉 Dépense</option>
              </select>
              <input
                type="text"
                placeholder="Catégorie"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="number"
                placeholder="Montant (€)"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addTransaction}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddTransaction(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">👥 Ajouter un Employé</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Poste"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Département"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="number"
                placeholder="Salaire annuel (€)"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: parseFloat(e.target.value) || 0})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="date"
                placeholder="Date d'embauche"
                value={newEmployee.hire_date}
                onChange={(e) => setNewEmployee({...newEmployee, hire_date: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              />
              <select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as Employee['status']})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              >
                <option value="active">✅ Actif</option>
                <option value="on_leave">🏖️ En congé</option>
                <option value="inactive">💤 Inactif</option>
              </select>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addEmployee}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
