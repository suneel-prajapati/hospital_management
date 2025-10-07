# Hospital Management System (HMS)

A modern, full-featured Hospital Management System built with React, TypeScript, and Material Design 3 principles. This application provides comprehensive tools for managing hospital operations including patient records, doctor schedules, appointments, billing, and room management.

## Features

### Core Modules

1. **Dashboard**
   - Real-time statistics and metrics
   - Total patients, doctors, appointments, and revenue tracking
   - Available rooms and occupancy rates
   - Recent activity feed
   - Performance indicators

2. **Patient Management**
   - Complete CRUD operations for patient records
   - Patient registration with detailed information
   - Search and filter capabilities
   - Track patient demographics and contact details

3. **Doctor Management**
   - Doctor registration and profile management
   - Specialization tracking
   - Availability schedule management
   - Contact information and credentials

4. **Appointment Management**
   - Book appointments between patients and doctors
   - Schedule management with date and time
   - Appointment status tracking (Pending, Completed, Cancelled)
   - View past and upcoming appointments

5. **Billing System**
   - Create and manage bills for patients
   - Automatic total calculation
   - Separate tracking for doctor charges, room charges, and medicine charges
   - Payment status management (Paid/Unpaid)
   - Revenue analytics and reporting

6. **Room Management**
   - Manage hospital rooms and wards
   - Room type classification (General, ICU, Private)
   - Real-time availability tracking
   - Patient assignment to rooms
   - Occupancy statistics

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Material Design 3 principles
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: LocalStorage (can be easily migrated to MySQL/Supabase)

## Design Features

- **Material Design 3 (Material You)**: Clean, modern, and professional UI
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Single-Page Application**: Dynamic content loading without page refreshes
- **Color-Coded Modules**: Each module has its own accent color for easy identification
- **Smooth Animations**: Transitions and hover effects for better UX
- **Dark/Light UI Elements**: Professional color scheme with proper contrast

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. Clone or download the project

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Database Schema

The application uses the following data structure. When migrating to MySQL or another database, use these schemas:

### Patients Table
```sql
CREATE TABLE patients (
  id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
  id VARCHAR(36) PRIMARY KEY,
  doctor_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  availability VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  appointment_id VARCHAR(10) UNIQUE NOT NULL,
  patient_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

### Bills Table
```sql
CREATE TABLE bills (
  id VARCHAR(36) PRIMARY KEY,
  bill_id VARCHAR(10) UNIQUE NOT NULL,
  patient_id VARCHAR(36) NOT NULL,
  doctor_charges DECIMAL(10,2) DEFAULT 0.00,
  room_charges DECIMAL(10,2) DEFAULT 0.00,
  medicine_charges DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  payment_status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
```

### Rooms Table
```sql
CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY,
  room_id VARCHAR(10) UNIQUE NOT NULL,
  room_type ENUM('General', 'ICU', 'Private') NOT NULL,
  availability_status ENUM('Available', 'Occupied') DEFAULT 'Available',
  assigned_patient_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_patient_id) REFERENCES patients(id) ON DELETE SET NULL
);
```

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Dashboard with statistics
│   │   ├── PatientManagement.tsx   # Patient CRUD operations
│   │   ├── DoctorManagement.tsx    # Doctor CRUD operations
│   │   ├── AppointmentManagement.tsx # Appointment scheduling
│   │   ├── BillingSystem.tsx       # Billing and payments
│   │   └── RoomManagement.tsx      # Room management
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── utils/
│   │   └── database.ts             # Data management utilities
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── index.html
└── package.json
```

## Features in Detail

### Form Validation
- Required field validation
- Type checking for numeric inputs
- Date and time validation
- Dropdown selections with proper defaults

### Search & Filter
- Real-time search across all modules
- Filter by multiple criteria (ID, name, type, status)
- Case-insensitive search

### Data Operations
- Create: Add new records with auto-generated IDs
- Read: View all records with detailed information
- Update: Edit existing records
- Delete: Remove records with confirmation dialogs

### User Experience
- Confirmation dialogs for destructive actions
- Success/error feedback
- Loading states
- Responsive modals and forms
- Smooth page transitions
- Collapsible sidebar

## Sample Data

The application comes with pre-populated sample data:
- 3 sample patients
- 3 sample doctors (Cardiology, Orthopedics, Pediatrics)
- 2 sample appointments
- 1 sample bill
- 5 sample rooms (mixed types and availability)

## Future Enhancements

Potential features for future versions:
- Backend integration with MySQL/PostgreSQL
- User authentication and role-based access control
- Advanced reporting and analytics
- Export functionality (CSV, PDF)
- Email notifications for appointments
- Patient medical history tracking
- Prescription management
- Lab test results management
- Dark mode toggle
- Multi-language support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational and commercial use.

## Support

For issues, questions, or contributions, please refer to the project documentation or contact the development team.
