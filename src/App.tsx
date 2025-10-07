import { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  Bed,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import BillingSystem from './components/BillingSystem';
import RoomManagement from './components/RoomManagement';
import { initializeDatabase } from './utils/database';

type ViewType = 'dashboard' | 'patients' | 'doctors' | 'appointments' | 'billing' | 'rooms';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as ViewType, label: 'Patients', icon: Users },
    { id: 'doctors' as ViewType, label: 'Doctors', icon: UserPlus },
    { id: 'appointments' as ViewType, label: 'Appointments', icon: Calendar },
    { id: 'billing' as ViewType, label: 'Billing', icon: DollarSign },
    { id: 'rooms' as ViewType, label: 'Rooms', icon: Bed },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'billing':
        return <BillingSystem />;
      case 'rooms':
        return <RoomManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HMS</h1>
                <p className="text-xs text-gray-500">Hospital Management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <p className="text-xs font-medium text-gray-600">System Status</p>
              <p className="text-sm font-bold text-gray-900 mt-1">All Systems Operational</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === currentView)?.label}
                </h2>
                <p className="text-sm text-gray-500">Manage and monitor hospital operations</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
