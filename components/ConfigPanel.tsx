import React from 'react';
import { InterviewConfig, InterviewPhase } from '../types';
import { SpinnerIcon } from './icons';

interface ConfigPanelProps {
  config: InterviewConfig;
  setConfig: React.Dispatch<React.SetStateAction<InterviewConfig>>;
  onStart: () => void;
  onEnd: () => void;
  onReset: () => void;
  onBuyCredits: () => void;
  onViewFeedback: () => void;
  phase: InterviewPhase;
  isLoading: boolean;
  credits: number;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onStart, onEnd, onReset, onBuyCredits, onViewFeedback, phase, isLoading, credits }) => {
  const isConfigPhase = phase === InterviewPhase.CONFIG;
  const isFormValid = config.candidateName && config.companyName && config.jobRole && config.companyUrl;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const renderButton = () => {
    switch (phase) {
      case InterviewPhase.CONFIG:
        if (credits <= 0) {
          return (
            <>
              <button
                onClick={onBuyCredits}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-200"
              >
                Buy More Credits
              </button>
              <p className="text-center text-red-400 text-sm mt-2">
                You've run out of credits. Purchase more to start a new interview.
              </p>
            </>
          );
        }
        return (
          <button
            onClick={onStart}
            disabled={!isFormValid || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            aria-disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <SpinnerIcon />
            ) : (
              'Start Interview (1 Credit)'
            )}
          </button>
        );
      case InterviewPhase.IN_PROGRESS:
      case InterviewPhase.GENERATING_FEEDBACK:
        return (
          <button
            onClick={onEnd}
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-emerald-700 transition-colors duration-200"
          >
            {phase === InterviewPhase.GENERATING_FEEDBACK ? (
              <span className="flex items-center justify-center gap-2"><SpinnerIcon /> Generating...</span>
            ) : 'End Interview'}
          </button>
        );
      case InterviewPhase.ENDED:
        return (
          <button
            onClick={onViewFeedback}
            className="w-full bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-800 transition-colors duration-200"
          >
            View Feedback Report
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-emerald-900 p-6 rounded-xl flex flex-col h-full shadow-lg">
      <div className="flex-grow space-y-4">
        <div>
          <label htmlFor="candidateName" className="block text-sm font-bold italic text-yellow-400 mb-1">Your Name</label>
          <input
            type="text"
            id="candidateName"
            name="candidateName"
            value={config.candidateName}
            onChange={handleInputChange}
            disabled
            placeholder="Set in your profile"
            className="w-full bg-emerald-800 border border-emerald-700 rounded-md px-3 py-2 text-sm font-bold italic text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-emerald-400 mt-1">Your name is set on your profile page.</p>
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-bold italic text-yellow-400 mb-1">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={config.companyName}
            onChange={handleInputChange}
            disabled={!isConfigPhase}
            placeholder="e.g., Google"
            className="w-full bg-emerald-800 border border-emerald-700 rounded-md px-3 py-2 text-sm font-bold italic text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="jobRole" className="block text-sm font-bold italic text-yellow-400 mb-1">Job Role</label>
          <input
            type="text"
            id="jobRole"
            name="jobRole"
            value={config.jobRole}
            onChange={handleInputChange}
            disabled={!isConfigPhase}
            placeholder="e.g., Senior Frontend Engineer"
            className="w-full bg-emerald-800 border border-emerald-700 rounded-md px-3 py-2 text-sm font-bold italic text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="companyUrl" className="block text-sm font-bold italic text-yellow-400 mb-1">Company Website URL</label>
          <input
            type="url"
            id="companyUrl"
            name="companyUrl"
            value={config.companyUrl}
            onChange={handleInputChange}
            disabled={!isConfigPhase}
            placeholder="e.g., https://about.google"
            className="w-full bg-emerald-800 border border-emerald-700 rounded-md px-3 py-2 text-sm font-bold italic text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-emerald-800">
        {renderButton()}
      </div>
    </div>
  );
};

export default ConfigPanel;
