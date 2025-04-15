import React, { useEffect, useState } from 'react';
import ConfirmationPopup from '../ui/pop-up/ConfirmationPopUp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { updateNotificationSettings } from '../../features/notificationSetting/notificationSettingApi';

const NotificationSettings: React.FC = () => {

    const {settings}=useSelector((state:RootState)=>state.notificationSetting)
    const dispatch=useDispatch<AppDispatch>()
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    type: 'email' | 'inApp';
    value: boolean;
  } | null>(null);

  const handleToggleClick = (type: 'email' | 'inApp', currentValue: boolean) => {
    setPendingToggle({ type, value: !currentValue });
    setIsPopupOpen(true);
  };

  const handleConfirm = () => {
    if (pendingToggle) {
      if (pendingToggle.type === 'email') {
        setEmailEnabled(pendingToggle.value);
        dispatch(updateNotificationSettings({ emailNotifications: pendingToggle.value, }));
      } else if (pendingToggle.type === 'inApp') {
        dispatch(updateNotificationSettings({ inAppNotifications: pendingToggle.value, }));
        setInAppEnabled(pendingToggle.value);
      }
    }
    setIsPopupOpen(false);
    setPendingToggle(null);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setPendingToggle(null);
  };

  useEffect(() => {
    if (settings) {
      setEmailEnabled(settings.emailNotifications);
      setInAppEnabled(settings.inAppNotifications);
    }
  }, [settings])
  

  return (
    <div className="w-full mx-auto mt-10 bg-white rounded-xl p-6 space-y-6 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h2 className="text-2xl font-bold text-gray-800">Notification Settings</h2>

      {/* Email Notification Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Email Notifications</span>
        <button
          onClick={() => handleToggleClick('email', emailEnabled)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
            emailEnabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              emailEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* In-App Notification Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">In-App Notifications</span>
        <button
          onClick={() => handleToggleClick('inApp', inAppEnabled)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
            inAppEnabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              inAppEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationPopup
        isOpen={isPopupOpen}
        title="Confirm Setting Change"
        message={`Are you sure you want to ${
          pendingToggle?.value ? 'enable' : 'disable'
        } ${pendingToggle?.type === 'email' ? 'Email' : 'In-App'} Notifications?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default NotificationSettings;
