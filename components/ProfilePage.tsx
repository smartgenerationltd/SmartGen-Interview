import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { UserIcon, SparklesIcon, EditIcon } from './icons';

interface ProfilePageProps {
  initialProfile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
  onNavigateBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ initialProfile, onSave, onNavigateBack }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, name: e.target.value });
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, picture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSaveChanges = () => {
    onSave(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Hide message after 2s
  };

  return (
    <div className="bg-emerald-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-400 mb-6">Your Profile</h2>
      
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-32 h-32">
          {profile.picture ? (
            <img src={profile.picture} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-emerald-700" />
          ) : (
            <div className="w-full h-full rounded-full bg-emerald-800 flex items-center justify-center border-4 border-emerald-700">
              <UserIcon />
            </div>
          )}
          <button 
            onClick={triggerFileSelect}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-110"
            aria-label="Upload profile picture"
          >
            <EditIcon />
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handlePictureUpload}
            accept="image/*"
            className="hidden" 
          />
        </div>
        <p className="text-emerald-400 text-sm">Click the icon to upload an image</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="profileName" className="block text-sm font-bold italic text-yellow-400 mb-1">Your Name</label>
          <input
            type="text"
            id="profileName"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            placeholder="e.g., Alex Doe"
            className="w-full bg-emerald-800 border border-emerald-700 rounded-md px-3 py-2 text-sm font-bold italic text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={onNavigateBack}
          className="bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          Back to Interview
        </button>
        <button
          onClick={handleSaveChanges}
          className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {isSaved ? (
            <>
              <SparklesIcon className="w-5 h-5" />
              Saved!
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
