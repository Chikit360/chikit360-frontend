import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/user.slice'
import medicineReducer from '../features/medicine/medicine.slice'
import saleReducer from './sale/sale.slice'
import activeMedicineReducer from '../features/medicine/activeMedicine.slice'
import authMiddleware from './middlewares/authMiddleware'
import inventoryReducer from './inventory/inventory.slice';
import customerReducer from './customer/customerSlice';
import adminReducer from './admin/adminSlice';
import superAdminReducer from './superAdmin/superAdminSlice';
import dropdownReducer from './dropDown/dropDownSlice';
import notificationReducer from './notifications/notificationSlice';
import hospitalReducer from './hospitals/hospital.slice';
import notificationSettingReducer from './notificationSetting/notificationSettingSlice';
import userReducer from './user/userSlice';
import subscriptionReducer from './subscription/subscriptionSlice';
import offerPlanReducer from './offerPlan/offerPlanSlice';
import inquiryReducer from './inquiry/inquirySlice';

import fileUploadReducer from './file-upload/fileUploadSlice';

const store = configureStore({
  reducer: {
    admin: adminReducer,
    users:userReducer,
    superAdmin: superAdminReducer,
    auth: authReducer,
    medicine:medicineReducer,
    inventory:inventoryReducer,
    activeMedicines:activeMedicineReducer,
    sales: saleReducer,
    customers:customerReducer,
    dropDown:dropdownReducer,
    
    notifications: notificationReducer,
    hospitals: hospitalReducer,
    notificationSetting:notificationSettingReducer,
    subscription:subscriptionReducer,
    offerPlan:offerPlanReducer,
    inquiry:inquiryReducer,
    uploadFile:fileUploadReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
