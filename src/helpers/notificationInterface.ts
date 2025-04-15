// types/notificationSetting.ts

export interface NotificationSettingI {
    user: string;
    emailNotifications: boolean;
    inAppNotifications: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  