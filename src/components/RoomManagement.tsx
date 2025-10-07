import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Bed } from 'lucide-react';
import { Room } from '../types';
import { getRooms, saveRoom, deleteRoom, generateNextId, getPatients } from '../utils/database';

function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const patients = getPatients();

  const [formData, setFormData] = useState({
    room_id: '',
    room_type: 'General' as 'General' | 'ICU' | 'Private',
    availability_status: 'Available' as 'Available' | 'Occupied',
    assigned_patient_id: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    setRooms(getRooms());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRoom) {
      const room: Room = {
        ...editingRoom,
        room_type: formData.room_type,
        availability_status: formData.availability_status,
        assigned_patient_id: formData.assigned_patient_id || null,
      };
      saveRoom(room);
    } else {
      if (!formData.room_id) {
        alert('Please enter a room ID');
        return;
      }

      const room: Room = {
        id: crypto.randomUUID(),
        room_id: formData.room_id,
        room_type: formData.room_type,
        availability_status: formData.availability_status,
        assigned_patient_id: formData.assigned_patient_id || null,
        created_at: new Date().toISOString(),
      };
      saveRoom(room);
    }

    loadRooms();
    handleCloseModal();
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      room_id: room.room_id,
      room_type: room.room_type,
      availability_status: room.availability_status,
      assigned_patient_id: room.assigned_patient_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteRoom(id);
    loadRooms();
    setShowDeleteConfirm(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({
      room_id: '',
      room_type: 'General',
      availability_status: 'Available',
      assigned_patient_id: '',
    });
  };

  const getPatientName = (id: string | null) => {
    if (!id) return '-';
    return patients.find((p) => p.id === id)?.name || 'Unknown';
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.room_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableRooms = rooms.filter((r) => r.availability_status === 'Available').length;
  const occupiedRooms = rooms.filter((r) => r.availability_status === 'Occupied').length;

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'General':
        return 'bg-blue-50 text-blue-700';
      case 'ICU':
        return 'bg-red-50 text-red-700';
      case 'Private':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Room Management</h3>
          <p className="text-gray-600">Manage hospital rooms and bed assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Rooms</p>
              <h4 className="text-2xl font-bold text-gray-900">{rooms.length}</h4>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Bed className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
              <h4 className="text-2xl font-bold text-green-600">{availableRooms}</h4>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <Bed className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Occupied</p>
              <h4 className="text-2xl font-bold text-red-600">{occupiedRooms}</h4>
            </div>
            <div className="bg-red-50 p-3 rounded-xl">
              <Bed className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by room ID or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Room ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Room Type</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Assigned Patient</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">{room.room_id}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.room_type)}`}>
                      {room.room_type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.availability_status === 'Available'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {room.availability_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{getPatientName(room.assigned_patient_id)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(room.id)}
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
          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No rooms found</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room ID *</label>
                <input
                  type="text"
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={!!editingRoom}
                  placeholder="e.g., ROOM101"
                />
                {editingRoom && <p className="text-xs text-gray-500 mt-1">Room ID cannot be changed</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                <select
                  value={formData.room_type}
                  onChange={(e) =>
                    setFormData({ ...formData, room_type: e.target.value as 'General' | 'ICU' | 'Private' })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status *</label>
                <select
                  value={formData.availability_status}
                  onChange={(e) =>
                    setFormData({ ...formData, availability_status: e.target.value as 'Available' | 'Occupied' })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>

              {formData.availability_status === 'Occupied' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Patient</label>
                  <select
                    value={formData.assigned_patient_id}
                    onChange={(e) => setFormData({ ...formData, assigned_patient_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">None</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.patient_id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
                >
                  {editingRoom ? 'Update Room' : 'Add Room'}
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
              Are you sure you want to delete this room? This action cannot be undone.
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

export default RoomManagement;
