import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, DollarSign } from 'lucide-react';
import { Bill } from '../types';
import { getBills, saveBill, deleteBill, generateNextId, getPatients } from '../utils/database';

function BillingSystem() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const patients = getPatients();

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_charges: '',
    room_charges: '',
    medicine_charges: '',
    payment_status: 'Unpaid' as 'Paid' | 'Unpaid',
  });

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    setBills(getBills());
  };

  const calculateTotal = () => {
    const doctorCharges = parseFloat(formData.doctor_charges) || 0;
    const roomCharges = parseFloat(formData.room_charges) || 0;
    const medicineCharges = parseFloat(formData.medicine_charges) || 0;
    return doctorCharges + roomCharges + medicineCharges;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patient_id) {
      alert('Please select a patient');
      return;
    }

    const totalAmount = calculateTotal();

    const bill: Bill = editingBill
      ? {
          ...editingBill,
          patient_id: formData.patient_id,
          doctor_charges: parseFloat(formData.doctor_charges) || 0,
          room_charges: parseFloat(formData.room_charges) || 0,
          medicine_charges: parseFloat(formData.medicine_charges) || 0,
          total_amount: totalAmount,
          payment_status: formData.payment_status,
        }
      : {
          id: crypto.randomUUID(),
          bill_id: generateNextId('BILL', bills.map((b) => b.bill_id)),
          patient_id: formData.patient_id,
          doctor_charges: parseFloat(formData.doctor_charges) || 0,
          room_charges: parseFloat(formData.room_charges) || 0,
          medicine_charges: parseFloat(formData.medicine_charges) || 0,
          total_amount: totalAmount,
          payment_status: formData.payment_status,
          created_at: new Date().toISOString(),
        };

    saveBill(bill);
    loadBills();
    handleCloseModal();
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      patient_id: bill.patient_id,
      doctor_charges: bill.doctor_charges.toString(),
      room_charges: bill.room_charges.toString(),
      medicine_charges: bill.medicine_charges.toString(),
      payment_status: bill.payment_status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteBill(id);
    loadBills();
    setShowDeleteConfirm(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBill(null);
    setFormData({
      patient_id: '',
      doctor_charges: '',
      room_charges: '',
      medicine_charges: '',
      payment_status: 'Unpaid',
    });
  };

  const getPatientName = (id: string) => {
    return patients.find((p) => p.id === id)?.name || 'Unknown';
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.bill_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientName(bill.patient_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total_amount, 0);
  const paidRevenue = bills.filter((b) => b.payment_status === 'Paid').reduce((sum, bill) => sum + bill.total_amount, 0);
  const unpaidRevenue = bills.filter((b) => b.payment_status === 'Unpaid').reduce((sum, bill) => sum + bill.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Billing System</h3>
          <p className="text-gray-600">Manage bills and payment records</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Bill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <h4 className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</h4>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Paid</p>
              <h4 className="text-2xl font-bold text-green-600">${paidRevenue.toFixed(2)}</h4>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unpaid</p>
              <h4 className="text-2xl font-bold text-red-600">${unpaidRevenue.toFixed(2)}</h4>
            </div>
            <div className="bg-red-50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by bill ID or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Bill ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Patient</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Doctor Charges</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Room Charges</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Medicine</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">{bill.bill_id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{getPatientName(bill.patient_id)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">${bill.doctor_charges.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">${bill.room_charges.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">${bill.medicine_charges.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 font-semibold">${bill.total_amount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bill.payment_status === 'Paid'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {bill.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(bill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No bills found</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingBill ? 'Edit Bill' : 'Create New Bill'}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.patient_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Charges ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.doctor_charges}
                    onChange={(e) => setFormData({ ...formData, doctor_charges: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Charges ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.room_charges}
                    onChange={(e) => setFormData({ ...formData, room_charges: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Charges ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.medicine_charges}
                    onChange={(e) => setFormData({ ...formData, medicine_charges: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-emerald-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status *</label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as 'Paid' | 'Unpaid' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                >
                  {editingBill ? 'Update Bill' : 'Create Bill'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this bill? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingSystem;
