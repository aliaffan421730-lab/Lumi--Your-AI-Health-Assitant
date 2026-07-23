import React, { useState } from 'react';
import { User, Mail, Phone, Heart, Award, Shield, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { userProfile, setUserProfile, showToast } = useApp();

  const [fullName, setFullName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone || '+92 300 1234567');
  const [bloodGroup, setBloodGroup] = useState(userProfile.bloodGroup);
  const [age, setAge] = useState(userProfile.age);
  const [heightCm, setHeightCm] = useState(userProfile.heightCm);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg);

  const handleSave = () => {
    setUserProfile({
      ...userProfile,
      fullName,
      email,
      phone,
      bloodGroup,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
    });
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <User className="w-6 h-6 text-blue-600" />
          Patient Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage personal medical information used by Lumi AI for context.
        </p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm flex items-center gap-5">
        <img
          src={userProfile.photoURL}
          alt={userProfile.fullName}
          className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900"
        />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {userProfile.fullName}
          </h2>
          <p className="text-xs text-slate-400">{userProfile.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
            Blood Group: {userProfile.bloodGroup}
          </span>
        </div>
      </div>

      {/* Form Grid */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Blood Group
            </label>
            <input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </div>
  );
};
