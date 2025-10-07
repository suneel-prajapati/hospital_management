import { useEffect, useState } from 'react';
import { Users, UserPlus, Calendar, DollarSign, Bed, TrendingUp } from 'lucide-react';
import { getPatients, getDoctors, getAppointments, getBills, getRooms } from '../utils/database';

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  trend?: string;
}

function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const patients = getPatients();
    const doctors = getDoctors();
    const appointments = getAppointments();
    const bills = getBills();
    const rooms = getRooms();

    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total_amount, 0);
    const paidBills = bills.filter((b) => b.payment_status === 'Paid').length;
    const availableRooms = rooms.filter((r) => r.availability_status === 'Available').length;
    const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;

    setStats([
      {
        title: 'Total Patients',
        value: patients.length,
        icon: Users,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        trend: '+12% from last month',
      },
      {
        title: 'Total Doctors',
        value: doctors.length,
        icon: UserPlus,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        trend: '+2 new this month',
      },
      {
        title: 'Appointments',
        value: pendingAppointments,
        icon: Calendar,
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        trend: `${pendingAppointments} pending`,
      },
      {
        title: 'Total Revenue',
        value: totalRevenue,
        icon: DollarSign,
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        trend: `${paidBills} bills paid`,
      },
      {
        title: 'Available Rooms',
        value: availableRooms,
        icon: Bed,
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
        trend: `${rooms.length - availableRooms} occupied`,
      },
      {
        title: 'Performance',
        value: 98,
        icon: TrendingUp,
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-600',
        trend: 'System efficiency',
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Overview</h3>
        <p className="text-gray-600">Monitor key metrics and hospital performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.title === 'Total Revenue' ? `$${stat.value.toLocaleString()}` : stat.value}
                  </h4>
                  {stat.trend && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h4>
          <div className="space-y-4">
            <ActivityItem
              title="New patient registered"
              description="John Smith added to the system"
              time="2 hours ago"
              color="bg-blue-100 text-blue-600"
            />
            <ActivityItem
              title="Appointment scheduled"
              description="Sarah Johnson with Dr. Emily Carter"
              time="5 hours ago"
              color="bg-green-100 text-green-600"
            />
            <ActivityItem
              title="Bill generated"
              description="BILL001 for Michael Brown"
              time="1 day ago"
              color="bg-orange-100 text-orange-600"
            />
            <ActivityItem
              title="Room assigned"
              description="ROOM301 assigned to patient"
              time="2 days ago"
              color="bg-purple-100 text-purple-600"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h4>
          <div className="space-y-4">
            <QuickStat label="Patient Satisfaction" value={95} unit="%" color="bg-blue-500" />
            <QuickStat label="Bed Occupancy Rate" value={68} unit="%" color="bg-green-500" />
            <QuickStat label="Average Wait Time" value={15} unit="min" color="bg-orange-500" />
            <QuickStat label="Staff Efficiency" value={92} unit="%" color="bg-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
  color,
}: {
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full ${color.split(' ')[0]} mt-2`}></div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {value}
          {unit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

export default Dashboard;
