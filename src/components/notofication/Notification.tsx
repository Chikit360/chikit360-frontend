import React, { useEffect, useState } from 'react';
import ConfirmationPopup from '../ui/pop-up/ConfirmationPopUp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { updateNotificationSettings } from '../../features/notificationSetting/notificationSettingApi';
import Label from '../form/Label';
import { CheckCircleIcon } from '../../icons';

const NotificationSettings: React.FC = () => {

    const {settings}=useSelector((state:RootState)=>state.notificationSetting)
    const dispatch=useDispatch<AppDispatch>()
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showInput, setShowInput] = useState(false)

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
        if(email===''){
          dispatch(updateNotificationSettings({email:email,password:password, emailNotifications: pendingToggle.value, }));
          
        }else{
          
          dispatch(updateNotificationSettings({ emailNotifications: pendingToggle.value, }));
        }
        setShowInput(false)
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
      if(settings.email!==null){
        setEmail(settings.email)
        setPassword(settings.password)

      }
    }
  }, [settings])
  

  return (
    <div className="w-full mx-auto mt-10 bg-white rounded-xl p-6 space-y-6 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h2 className="text-2xl font-bold text-gray-800">Notification Settings</h2>

      {/* Email Notification Toggle */}
      <div>
  <div className="flex items-center justify-between">
    <span className="text-gray-700">Email Notifications</span>
    <button
      onClick={() =>
        email === ''
          ? setShowInput(!showInput)
          : handleToggleClick('email', emailEnabled)
      }
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        (email === '' ? showInput : emailEnabled) ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          (email === '' ? showInput : emailEnabled) ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>

  {showInput && email === '' && (
    <div className="flex gap-4 space-y-2 mt-4 items-center">
      <div>
        <Label>Provide Your Email</Label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          type="email"
        />
        <span className="text-gray-500 text-sm">
          We will send you notifications to this email
        </span>
      </div>
      <div>
        <Label>Provide Your Password</Label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          type="password"
        />
        <span className="text-gray-500 text-sm">
          We will send you notifications to this email
        </span>
      </div>
      <CheckCircleIcon
        onClick={() => handleToggleClick('email', emailEnabled)}
        className="w-[79px] cursor-pointer"
      />
    </div>
  )}
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
