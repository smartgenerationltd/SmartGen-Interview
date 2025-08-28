import React, { useState, useCallback, useEffect } from 'react';
import { InterviewPhase, InterviewConfig, ChatMessage, FeedbackReport, UserProfile } from './types';
import ConfigPanel from './components/ConfigPanel';
import ChatWindow from './components/ChatWindow';
import FeedbackModal from './components/FeedbackModal';
import PaymentModal from './components/PaymentModal';
import { generateFirstQuestion, generateFollowUpQuestion, generateFeedbackReport } from './services/geminiService';
import { LogoIcon, UserIcon } from './components/icons';
import LoginScreen from './components/LoginScreen';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const initialConfig: InterviewConfig = {
    candidateName: '',
    companyName: '',
    jobRole: '',
    companyUrl: '',
    language: 'English',
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', picture: null });
  const [currentView, setCurrentView] = useState<'interview' | 'profile'>('interview');
  const [credits, setCredits] = useState<number>(10);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>(initialConfig);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [interviewPhase, setInterviewPhase] = useState<InterviewPhase>(InterviewPhase.CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackReport | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  
  const languages = [
    'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Belarusian', 
    'Bengali', 'Bosnian', 'Bulgarian', 'Catalan', 'Cebuano', 'Chichewa', 'Chinese (Simplified)', 
    'Chinese (Traditional)', 'Corsican', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 
    'Esperanto', 'Estonian', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician', 'Georgian', 
    'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 
    'Hmong', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian', 'Japanese', 
    'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda', 'Korean', 'Kurdish (Kurmanji)', 
    'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 
    'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)', 
    'Nepali', 'Norwegian', 'Odia (Oriya)', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 
    'Romanian', 'Russian', 'Samoan', 'Scots Gaelic', 'Serbian', 'Sesotho', 'Shona', 'Sindhi', 
    'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish', 
    'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 
    'Uyghur', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu'
  ];

  useEffect(() => {
    if (isAuthenticated) {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const parsedProfile: UserProfile = JSON.parse(savedProfile);
                setUserProfile(parsedProfile);
                setInterviewConfig(prev => ({ ...prev, candidateName: parsedProfile.name || '' }));
            }
        } catch (error) {
            console.error("Failed to load user profile from localStorage", error);
        }
    }
  }, [isAuthenticated]);

  const handleProfileSave = (newProfile: UserProfile) => {
    try {
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
        setUserProfile(newProfile);
        setInterviewConfig(prev => ({ ...prev, candidateName: newProfile.name }));
    } catch (error) {
        console.error("Failed to save user profile to localStorage", error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInterviewConfig(prev => ({ ...prev, language: e.target.value }));
  };

  const handleStart = async () => {
    if (credits <= 0) {
      setError("You don't have enough credits to start an interview.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setChatHistory([]);
    try {
      const firstQuestion = await generateFirstQuestion(interviewConfig);
      setChatHistory([{ role: 'model', content: firstQuestion }]);
      setInterviewPhase(InterviewPhase.IN_PROGRESS);
      setCredits(prev => prev - 1); // Deduct credit on success
    } catch (e) {
      setError('Failed to start the interview. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    setError(null);
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      const followUp = await generateFollowUpQuestion(interviewConfig, newHistory);
      setChatHistory(prev => [...prev, { role: 'model', content: followUp }]);
    } catch (e) {
      setError('Failed to get a follow-up question. Please try again.');
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'model', content: "I'm sorry, I've encountered a technical issue. Could you please rephrase your last answer?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnd = async () => {
    if (chatHistory.length === 0) {
      handleReset();
      return;
    }
    setError(null);
    setInterviewPhase(InterviewPhase.GENERATING_FEEDBACK);
    setIsLoading(true);

    try {
      const report = await generateFeedbackReport(interviewConfig, chatHistory);
      setFeedback(report);
      setInterviewPhase(InterviewPhase.ENDED);
      setIsFeedbackModalOpen(true);
    } catch (e) {
      setError('Failed to generate feedback report.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    // Keep user's name but reset other fields
    setInterviewConfig(prev => ({
        ...initialConfig,
        candidateName: prev.candidateName,
    }));
    setChatHistory([]);
    setInterviewPhase(InterviewPhase.CONFIG);
    setIsLoading(false);
    setError(null);
    setFeedback(null);
    setIsFeedbackModalOpen(false);
  }, [initialConfig]);

  const handleBuyCredits = () => {
    setIsPaymentModalOpen(true);
  };

  const handleSuccessfulPayment = () => {
    setCredits(prev => prev + 10);
    setIsPaymentModalOpen(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-emerald-950 font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="max-w-7xl mx-auto w-full mb-6 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-2xl font-bold text-sky-400">SmartGen Interview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-800 border border-emerald-700 rounded-md px-4 py-2 text-sm text-white font-semibold" aria-live="polite">
            Credits: {credits}
          </div>
          <div>
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <select
              id="language-select"
              value={interviewConfig.language}
              onChange={handleLanguageChange}
              disabled={interviewPhase !== InterviewPhase.CONFIG || currentView === 'profile'}
              aria-label="Select interview language"
              className="bg-emerald-800 border border-emerald-700 rounded-md px-3 py-2 text-sm font-bold italic text-yellow-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            >
              {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          <button onClick={() => setCurrentView('profile')} className="flex items-center gap-3 bg-emerald-800 border border-emerald-700 rounded-full p-1 pr-4 hover:bg-emerald-700 transition-colors">
            {userProfile.picture ? (
                <img src={userProfile.picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center">
                    <UserIcon />
                </div>
            )}
            <span className="font-semibold text-sm">{userProfile.name || 'My Profile'}</span>
          </button>
        </div>
      </header>
      
      {currentView === 'interview' && (!userProfile.name || !userProfile.picture) && (
        <div className="max-w-7xl mx-auto w-full mb-4 p-3 bg-indigo-900/50 border border-indigo-700 rounded-lg text-center">
          <p className="text-indigo-200 text-sm">
            Welcome! We suggest filling out your profile for a more personalized experience. 
            <button onClick={() => setCurrentView('profile')} className="font-bold underline ml-2 hover:text-white">
              Go to Profile
            </button>
          </p>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto w-full flex-grow flex">
        {currentView === 'interview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-1 h-full">
              <ConfigPanel
                config={interviewConfig}
                setConfig={setInterviewConfig}
                onStart={handleStart}
                onEnd={handleEnd}
                onReset={handleReset}
                onBuyCredits={handleBuyCredits}
                onViewFeedback={() => setIsFeedbackModalOpen(true)}
                phase={interviewPhase}
                isLoading={isLoading}
                credits={credits}
              />
            </div>
            <div className="lg:col-span-2 h-full">
              <ChatWindow
                messages={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                phase={interviewPhase}
              />
            </div>
          </div>
        ) : (
          <ProfilePage
            initialProfile={userProfile}
            onSave={handleProfileSave}
            onNavigateBack={() => setCurrentView('interview')}
          />
        )}
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      )}
      {isFeedbackModalOpen && feedback && (
        <FeedbackModal 
            feedback={feedback} 
            onClose={() => setIsFeedbackModalOpen(false)}
            onReset={handleReset}
        />
      )}
      {isPaymentModalOpen && (
        <PaymentModal 
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handleSuccessfulPayment}
        />
      )}
    </div>
  );
};

export default App;
