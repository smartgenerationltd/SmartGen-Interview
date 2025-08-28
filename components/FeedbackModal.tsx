import React, { useEffect, useState } from 'react';
import { FeedbackReport } from '../types';

interface FeedbackModalProps {
  feedback: FeedbackReport;
  onClose: () => void;
  onReset: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, onClose, onReset }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to final score
    if (feedback.score > 0) {
      const duration = 1000; // ms
      const startTime = Date.now();

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentScore = Math.floor(progress * feedback.score);
        setAnimatedScore(currentScore);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedScore(feedback.score);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [feedback.score]);

  const renderFeedback = () => {
    // Split by sections to apply specific styling
    const parts = feedback.report.split(/\*\*(.*?)\*\*/).filter(part => part.trim() !== '');
    
    return parts.map((part, index) => {
      const isTitle = [
        'Overall Assessment',
        'Key Strengths',
        'Areas for Improvement'
      ].includes(part);

      if (isTitle) {
        return (
          <h3 key={index} className="text-xl font-bold text-sky-400 mt-6 mb-2">
            {part}
          </h3>
        );
      }
      return (
        <p key={index} className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {part}
        </p>
      );
    });
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-emerald-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-emerald-800">
          <h2 className="text-2xl font-bold text-sky-400">Interview Feedback Report</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-xl font-bold text-sky-400 mb-4">Your Score</h3>
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  className="text-emerald-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="60"
                  cy="60"
                />
                <circle
                  className="text-sky-400"
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="60"
                  cy="60"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{animatedScore}</span>
                <span className="text-sm text-emerald-400">/ 100</span>
              </div>
            </div>
          </div>
          <hr className="border-emerald-800 my-6" />
          {renderFeedback()}
        </div>
        <div className="p-4 border-t border-emerald-800 flex justify-end gap-4">
           <button
            onClick={onClose}
            className="bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onReset}
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;