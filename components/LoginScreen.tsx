import React from 'react';
import { GoogleIcon, FacebookIcon, InstagramIcon, XIcon, LogoIcon } from './icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-emerald-950 text-slate-200">
      <div className="w-full max-w-sm mx-auto text-center bg-emerald-900/50 p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
        <div className="flex justify-center mb-6">
          <LogoIcon className="w-20 h-20" />
        </div>
        <h1 className="text-4xl font-bold text-sky-400 mb-2">SmartGen Interview</h1>
        <p className="text-emerald-300 mb-10">AI-Powered Interview Practice</p>
        
        <div className="space-y-4">
          <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-indigo-500">
            <GoogleIcon />
            <span className="font-semibold text-slate-200">Sign in with Google</span>
          </button>
          <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-indigo-500">
            <FacebookIcon />
            <span className="font-semibold text-slate-200">Sign in with Facebook</span>
          </button>
          <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-indigo-500">
            <InstagramIcon />
            <span className="font-semibold text-slate-200">Sign in with Instagram</span>
          </button>
          <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-indigo-500">
            <XIcon />
            <span className="font-semibold text-slate-200">Sign in with X</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;