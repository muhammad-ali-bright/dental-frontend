import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, ...props }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative group">
            {label && <label htmlFor={props.id} className="sr-only">{label}</label>}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                className="block w-full py-4 pl-12 pr-12 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            />
            <button
                type="button"
                onClick={() => setVisible(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
            >
                {visible ? <EyeOff /> : <Eye />}
            </button>
        </div>
    );
};

export default PasswordInput;
