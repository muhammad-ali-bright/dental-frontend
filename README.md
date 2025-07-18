# DentalCare - Dental Center Management System

A comprehensive React-based dental center management dashboard built for ENTNT Technical Assignment. This system manages patients, appointments, and provides role-based access for both administrators (dentists) and patients.

## 🌟 Features

### Authentication System
- **Role-based access control** (Admin/Patient)
- **Hardcoded user authentication** with localStorage session persistence
- **Automatic role-based redirects**

### Admin Features (Dentist)
- **Dashboard** with KPIs, upcoming appointments, top patients, revenue analytics
- **Patient Management** - Add, edit, delete patients with full contact and health information
- **Appointment Management** - Create, update, delete appointments with file attachments
- **Calendar View** - Monthly/weekly appointment visualization
- **File Upload Support** - Treatment records, invoices, X-rays stored as base64

### Patient Features
- **Personal Dashboard** with appointment overview and health summary
- **Appointment History** - View past and upcoming appointments
- **File Downloads** - Access treatment records and documents
- **Treatment Cost Tracking**

### Technical Features
- **Fully Responsive Design** - Works across all devices
- **Local Storage Persistence** - All data stored locally, no backend required
- **File Upload/Download** - Complete file management system
- **Real-time Updates** - Context-based state management
- **Modern UI/UX** - Clean, professional interface

## 🚀 Demo Accounts
Deploy link:- https://dental-center-complete.vercel.app/login
github link:- https://github.com/chandan0629/dental-center-complete

### Admin Account (Dentist)
- **Email:** admin@entnt.in
- **Password:** admin123
- **Access:** Full system administration

### Patient Accounts
- **Email:** john@entnt.in | **Password:** patient123
- **Access:** Personal dashboard and appointments only

## 🛠️ Technology Stack

- **Frontend:** React 19.1.0 with TypeScript
- **Styling:** TailwindCSS 4.1.11
- **Routing:** React Router DOM 7.6.3
- **State Management:** React Context API
- **Icons:** Lucide React
- **Calendar:** React Calendar
- **Date Handling:** date-fns
- **Build Tool:** Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   - Navigate to `http://localhost:3000`
   - Use demo accounts from above to login

### Production Build

```bash
npm run build
```

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Route protection component
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── AppContext.tsx  # Application data management
├── pages/              # Main application pages
│   ├── Login.tsx       # Authentication page
│   ├── Dashboard.tsx   # Admin dashboard
│   ├── PatientDashboard.tsx # Patient dashboard
│   ├── Patients.tsx    # Patient management
│   ├── Appointments.tsx # Appointment management
│   ├── CalendarView.tsx # Calendar interface
│   └── MyAppointments.tsx # Patient appointments
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
├── utils/              # Utility functions
│   └── storage.ts      # localStorage operations
└── App.tsx             # Main application component
```

### State Management Architecture

1. **AuthContext** - Manages user authentication and session
2. **AppContext** - Handles patients and appointments data
3. **localStorage** - Persists all data locally with mock data initialization

### Data Models

#### User Interface
```typescript
interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
}
```

#### Patient Interface
```typescript
interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  notes: string;
  email?: string;
}
```

#### Appointment/Appointment Interface
```typescript
interface Appointment {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  date: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  nextDate?: string;
  files: FileAttachment[];
}
```

## 🎯 Key Features Implementation

### File Upload System
- **Base64 Encoding** - Files converted to base64 for localStorage storage
- **Multiple File Types** - Support for PDF, DOC, images
- **File Preview & Download** - Complete file management interface

### Calendar Integration
- **Monthly/Weekly Views** - Interactive calendar with appointment visualization
- **Day Selection** - Click-to-view daily appointments
- **Appointment Indicators** - Visual markers for scheduled dates

### Responsive Design
- **Mobile-First Approach** - Optimized for all screen sizes
- **Collapsible Navigation** - Mobile-friendly sidebar
- **Touch-Friendly Controls** - Accessible on all devices

### Data Persistence
- **localStorage Integration** - All data persisted locally
- **Automatic Initialization** - Mock data loaded on first visit
- **Session Management** - User sessions maintained across browser restarts

## 🚨 Known Issues & Limitations

### Current Limitations
1. **File Storage** - Large files may cause performance issues due to base64 encoding
2. **Data Scalability** - localStorage has size limitations (~5-10MB)
3. **No Real-time Sync** - Multiple tabs may have data inconsistencies
4. **Basic Search** - Simple text-based filtering only

### Browser Compatibility
- **Modern Browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers** - iOS Safari, Chrome Mobile
- **localStorage Required** - Application won't work without localStorage support

## 🔮 Future Enhancements

### Potential Improvements
1. **Advanced Search & Filtering** - Multi-criteria search with date ranges
2. **Appointment Reminders** - Browser notifications for upcoming appointments
3. **Data Export** - PDF reports and CSV exports
4. **Advanced Calendar Features** - Drag-and-drop appointment scheduling
5. **Treatment Templates** - Pre-defined treatment workflows
6. **Patient Communication** - In-app messaging system

### Technical Debt
1. **Error Boundaries** - Better error handling and user feedback
2. **Unit Testing** - Comprehensive test coverage
3. **Performance Optimization** - Virtual scrolling for large datasets
4. **Accessibility** - WCAG compliance improvements

## 🎨 Design Decisions

### UI/UX Choices
- **Color Scheme** - Medical blue (#2563eb) for trust and professionalism
- **Typography** - Clean, readable fonts suitable for medical applications
- **Icons** - Lucide React for consistent, modern iconography
- **Layout** - Card-based design for easy information scanning

### Technical Decisions
- **TypeScript** - Type safety and better development experience
- **Context API** - Simpler than Redux for this application scope
- **TailwindCSS** - Rapid development with utility-first CSS
- **React Router** - Standard routing solution for React applications

## 🤝 Contributing

This is a technical assignment project. For any questions or suggestions:
- **Email:** chandantoaws@gmail.com
- **Assignment:** ENTNT Technical Assignment - Frontend Developer (React)

## 📄 License

This project is created for educational purposes as part of the ENTNT technical assignment.

---

**Built with ❤️ for ENTNT Technical Assignment**
