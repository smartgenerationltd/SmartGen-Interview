import React from 'react';
import { MoMoPayIcon, BankAccountIcon } from './icons';

interface PaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentSuccess }) => {
  const handlePayment = () => {
    // In a real app, this would involve a payment gateway integration.
    // For this prototype, we just simulate success.
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-emerald-900 rounded-xl shadow-2xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-emerald-800">
          <h2 className="text-2xl font-bold text-sky-400 text-center">Get More Credits</h2>
        </div>
        <div className="p-8 space-y-6">
          <p className="text-center text-slate-300">
            Your credits have run out. Purchase more to continue your interview practice.
          </p>
          <div className="bg-emerald-800 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-white">10 Credits</p>
            <p className="text-emerald-400">for a one-time payment</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 border border-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-white"
            >
              <MoMoPayIcon />
              <span className="font-semibold text-white">Pay with MoMoPay</span>
            </button>
            <button
              onClick={handlePayment}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 border border-sky-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-white"
            >
              <BankAccountIcon />
              <span className="font-semibold text-white">Pay with Bank Account</span>
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-emerald-800 text-center">
          <button
            onClick={onClose}
            className="text-emerald-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;