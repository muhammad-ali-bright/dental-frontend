import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading: boolean;
    text: string;
    icon?: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, text, icon, ...props }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className="group relative w-full flex justify-center py-4 px-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    >
        {loading ? (
            <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
            </div>
        ) : (
            <span className="flex items-center">
                {icon && <span className="mr-2">{icon}</span>}
                {text}
            </span>
        )}
    </button>
);

export default LoadingButton;
