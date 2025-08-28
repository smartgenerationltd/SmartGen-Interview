
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, InterviewPhase } from '../types';
import { SendIcon, BotIcon, UserIcon, SpinnerIcon } from './icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  phase: InterviewPhase;
}

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 bg-emerald-800 rounded-full p-2">
          <BotIcon />
        </div>
      )}
      <div className={`max-w-xl p-4 rounded-xl shadow ${isModel ? 'bg-emerald-800 text-slate-200 rounded-tl-none' : 'bg-indigo-600 text-white rounded-br-none'}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {!isModel && (
         <div className="flex-shrink-0 bg-emerald-800 rounded-full p-2">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, phase }) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading && phase === InterviewPhase.IN_PROGRESS) {
      onSendMessage(inputText);
      setInputText('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="bg-emerald-900/50 backdrop-blur-sm p-4 rounded-xl flex flex-col h-full shadow-lg">
      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && phase !== InterviewPhase.CONFIG && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-emerald-800 rounded-full p-2">
                <BotIcon />
            </div>
            <div className="bg-emerald-800 p-4 rounded-xl rounded-tl-none flex items-center gap-2">
                <SpinnerIcon />
                <span className="text-emerald-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="mt-4 pt-4 border-t border-emerald-800">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              phase === InterviewPhase.CONFIG ? "Start the interview to begin..." :
              phase === InterviewPhase.IN_PROGRESS ? "Type your answer here..." :
              "Interview has ended."
            }
            disabled={isLoading || phase !== InterviewPhase.IN_PROGRESS}
            rows={3}
            className="w-full bg-emerald-800 border border-emerald-700 rounded-lg p-3 pr-14 text-sm font-bold italic text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || phase !== InterviewPhase.IN_PROGRESS}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-emerald-700 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;