// src/layouts/Layout.tsx
import React from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Home,
  Users,
  Calendar as CalendarIcon,
  FileText,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // mobile drawer open/closed
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  // desktop collapse open/closed
  const [collapsed, setCollapsed] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const adminNav = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: FileText },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  ]
  const patientNav = [
    { path: '/patient-dashboard', label: 'My Dashboard', icon: Home },
    { path: '/my-appointments', label: 'My Appointments', icon: FileText },
  ]
  const navItems = user?.role === 'Student' ? adminNav : patientNav
  const isActive = (p: string) => location.pathname === p

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
      {/* Mobile header with contrasting toggle */}
      <header className="lg:hidden w-full bg-primary-600 shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">DentalCare</h1>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-2 bg-white rounded-full shadow-md text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar / drawer */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            w-64 ${collapsed ? 'lg:w-20' : 'lg:w-72'}
            bg-white shadow-lg h-full
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Desktop collapse hamburger */}
          <div className="absolute top-4 -right-3 hidden lg:block">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-2 bg-white rounded-full shadow-md text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-primary-600 px-4">
            {!collapsed && (
              <h1 className="text-xl font-bold text-white">DentalCare</h1>
            )}
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-primary-600" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 px-2 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-4 left-0 right-0 px-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 h-full overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
