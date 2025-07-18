# DentalCare - Demo Guide

## 🎯 Application Features Demo

### 1. **Admin Login (Dentist)**
- **Email:** admin@entnt.in
- **Password:** admin123
- **Features:** Full system access, patient management, appointments, calendar view

### 2. **Patient Login**
- **Email:** john@entnt.in | **Password:** patient123
- **Email:** jane@entnt.in | **Password:** patient123
- **Features:** Personal dashboard, appointment history, file downloads

---

## 🚀 Admin Dashboard Features

### Dashboard Overview
- **KPIs:** Total patients, today's appointments, monthly revenue, completed treatments
- **Upcoming Appointments:** Next 10 appointments with patient details
- **Top Patients:** Most active patients by appointment count
- **Weekly Schedule:** This week's appointment overview

### Patient Management
- **Add Patient:** Create new patient with personal and health information
- **Edit Patient:** Update patient details including health info
- **Delete Patient:** Remove patient (with confirmation for existing appointments)
- **Search & Filter:** Find patients by name, email, or phone

### Appointment Management
- **Create Appointment:** Schedule new appointments with patient selection
- **Edit Appointment:** Update appointment details, status, and treatment info
- **File Upload:** Attach treatment records, invoices, X-rays (base64 storage)
- **Status Tracking:** Scheduled → InProgress → Completed workflow
- **Cost Management:** Track treatment costs and revenue

### Calendar View
- **Monthly View:** Full month calendar with appointment indicators
- **Weekly View:** Detailed week view with daily appointments
- **Day Selection:** Click any day to view scheduled appointments
- **Monthly Summary:** Revenue and appointment statistics

---

## 👨‍⚕️ Patient Dashboard Features

### Personal Dashboard
- **Profile Information:** DOB, contact, email, health information
- **Quick Stats:** Upcoming appointments, completed treatments, total spent
- **Next Appointment:** Highlighted next scheduled visit
- **Treatment History:** Recent completed treatments with costs

### My Appointments
- **Upcoming Appointments:** Future scheduled visits with details
- **Appointment History:** Past treatments with status and costs
- **File Downloads:** Access treatment records, invoices, X-rays
- **Cost Tracking:** Total amount spent on treatments

---

## 🔧 Technical Features

### Data Management
- **localStorage Persistence:** All data saved locally, no backend required
- **Mock Data:** Pre-populated with sample patients and appointments
- **Real-time Updates:** Instant UI updates with Context API
- **Session Management:** Login state persists across browser sessions

### File Handling
- **File Upload:** Support for PDF, DOC, images up to 10MB
- **Base64 Storage:** Files converted and stored in localStorage
- **Download Feature:** Click to download attached files
- **Multiple Files:** Support for multiple file attachments per appointment

### Responsive Design
- **Mobile-First:** Optimized for all screen sizes
- **Touch-Friendly:** Easy navigation on mobile devices
- **Collapsible Menu:** Space-efficient navigation
- **Modern UI:** Clean, professional medical interface

---

## 📊 Sample Data Walkthrough

### Pre-loaded Patients
1. **John Doe** (DOB: 1990-05-10, No allergies)
2. **Jane Smith** (DOB: 1985-08-15, Diabetic, allergic to penicillin)
3. **Bob Johnson** (DOB: 1978-12-03, High blood pressure)

### Sample Appointments
1. **Toothache** - John Doe (Completed, $80)
2. **Dental Cleaning** - Jane Smith (Scheduled, $120)
3. **Follow-up** - John Doe (Scheduled)

---

## 🎮 Demo Flow

### Admin Experience
1. **Login** → Dashboard overview
2. **Add Patient** → Create new patient record
3. **Schedule Appointment** → Book appointment with file upload
4. **Calendar View** → Visualize monthly schedule
5. **Update Status** → Mark appointments as completed

### Patient Experience
1. **Login** → Personal dashboard with overview
2. **View Appointments** → Check upcoming and past appointments
3. **Download Files** → Access treatment records
4. **Track Costs** → View total spent on treatments

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy script
./deploy.sh
```

**Access the app at:** http://localhost:3000
