import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { AvatarCropModal } from '../common/AvatarCropModal';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Crop,
  Edit2,
  Save,
  Sparkles
} from 'lucide-react';

interface UserProfilePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'password';
}

export const UserProfilePasswordModal: React.FC<UserProfilePasswordModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile'
}) => {
  const { currentUser, updateCurrentUserProfile, changePassword } = useAcademy();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>(defaultTab);
  const [showCropModal, setShowCropModal] = useState(false);

  // Profile fields state
  const [profileName, setProfileName] = useState(currentUser.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '+880 1711-223344');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar || '');

  // Password fields state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfilePhone(currentUser.phone || '+880 1711-223344');
      setProfileAvatar(currentUser.avatar || '');
      setActiveTab(defaultTab);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, currentUser, defaultTab]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!profileName.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    updateCurrentUserProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar: profileAvatar
    });

    setSuccessMsg('Profile picture and details updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  const handleCropSave = (croppedDataUrl: string) => {
    setProfileAvatar(croppedDataUrl);
    updateCurrentUserProfile({
      avatar: croppedDataUrl
    });
    setShowCropModal(false);
    setSuccessMsg('Profile picture cropped and updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation password do not match.');
      return;
    }

    if (newPassword.length < 5) {
      setErrorMsg('New password must be at least 5 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = changePassword(currentUser.id, oldPassword, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">User Profile & Picture Settings</h3>
                <p className="text-xs text-slate-500">Manage photo, name, and login credentials</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'profile'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Picture & Profile (ছবি ও প্রোফাইল)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('password');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'password'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password Security (পাসওয়ার্ড)</span>
            </button>
          </div>

          {/* Feedback Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: PICTURE & PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Picture with Crop Trigger */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="relative group">
                    <img
                      src={profileAvatar || currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCropModal(true)}
                      className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Crop and adjust photo"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{profileName || currentUser.name}</h4>
                    <p className="text-xs text-slate-500">{currentUser.role.replace('_', ' ')}</p>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Active Account
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCropModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop & Upload Photo (ছবি ক্রপ করুন)</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Display Name (আপনার নাম)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={e => setProfileEmail(e.target.value)}
                      placeholder="user@nexgenacademy.edu.bd"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Contact Phone</span>
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={e => setProfilePhone(e.target.value)}
                      placeholder="+880 1711-000000"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Role / Designation (System Assigned)</label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.role.replace('_', ' ')} (${currentUser.username || 'admin'})`}
                    className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile (সংরক্ষণ করুন)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PASSWORD FORM */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 5 characters"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Real-time Avatar Cropping Modal */}
      <AvatarCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        currentAvatar={profileAvatar || currentUser.avatar}
        userName={profileName || currentUser.name}
        onSaveAvatar={handleCropSave}
        title="Crop & Position Profile Picture"
      />
    </>
  );
};
