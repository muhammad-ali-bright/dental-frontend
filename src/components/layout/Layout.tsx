import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    Users,
    Calendar as CalendarIcon,
    FileText,
    LogOut,
    User,
    Menu,
    X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';
import toast, { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    // Persist collapsed state
    useEffect(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        if (stored) setCollapsed(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out');
            navigate('/login');
        } catch (err) {
            toast.error('Logout failed');
            console.error('Logout failed:', err);
        }
    };

    const navItems = useMemo(() => {
        if (!user) return [];
        return [
            { path: '/dashboard', label: 'Dashboard', icon: Home },
            { path: '/patients', label: 'Patients', icon: Users },
            { path: '/appointments', label: 'Appointments', icon: FileText },
            { path: '/calendar', label: 'Calendar', icon: CalendarIcon }
        ]
    }, [user]);

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    if (!user) return null;

    return (
        <div className="h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
            <Toaster />

            {/* Mobile Header */}
            <header className="lg:hidden w-full bg-primary-600 shadow px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">DentalCare</h1>
                <button
                    aria-label="Toggle sidebar"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="p-2 bg-white rounded-full shadow-md text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside
                    className={`
            fixed lg:static inset-y-0 left-0 z-50
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            ${collapsed ? 'w-20' : 'w-64 lg:w-72'}
            bg-white shadow-lg h-full
            transition-all duration-300 ease-in-out
                `}
                >
                    {/* Collapse Toggle */}
                    <div className="absolute top-4 -right-3 hidden lg:block">
                        <button
                            aria-label="Toggle sidebar collapse"
                            onClick={() => setCollapsed((c) => !c)}
                            className="p-2 bg-white rounded-full shadow-md text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 bg-primary-600 px-4">
                        {!collapsed && <h1 className="text-xl font-bold text-white">DentalCare</h1>}
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <User size={20} className="text-primary-600" />
                            </div>
                            {!collapsed && (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="mt-4 px-2 space-y-2">
                        {navItems.map((item) => (
                            <SidebarNavItem
                                key={item.path}
                                path={item.path}
                                label={item.label}
                                icon={item.icon}
                                collapsed={collapsed}
                                isActive={isActive(item.path)}
                                onClick={() => setSidebarOpen(false)}
                            />
                        ))}
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

                {/* Main */}
                <main className="flex-1 h-full overflow-auto p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
