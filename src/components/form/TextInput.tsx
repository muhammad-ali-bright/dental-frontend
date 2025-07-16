import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
}

const TextInput: React.FC<TextInputProps> = ({ icon, label, ...props }) => (
    <div className="relative group">
        {label && <label htmlFor={props.id} className="sr-only">{label}</label>}
        {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {icon}
            </div>
        )}
        <input
            {...props}
            className={`block w-full py-4 pl-${icon ? '12' : '4'} pr-4 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
        />
    </div>
);

export default TextInput;
