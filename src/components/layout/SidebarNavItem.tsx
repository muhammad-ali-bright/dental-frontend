// src/components/layout/SidebarNavItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
    path: string;
    label: string;
    icon: LucideIcon;
    collapsed: boolean;
    isActive: boolean;
    onClick?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
    path,
    label,
    icon: Icon,
    collapsed,
    isActive,
    onClick,
}) => {
    return (
        <Link
            to={path}
            onClick={onClick}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
        </Link>
    );
};

export default SidebarNavItem;
