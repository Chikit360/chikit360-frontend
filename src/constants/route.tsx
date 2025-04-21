import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import Home from "../pages/Dashboard/Home";
import AddStock from "../pages/inventory/AddStock";
import Stock from "../pages/inventory/Stock";
import UpdateStock from "../pages/inventory/UpdateStock";
import CreateMedicineForm from "../pages/medicine/CreateMedicineForm";
import MedicineList from "../pages/medicine/MedicineList";
import UpdateMedicineForm from "../pages/medicine/UpdateMedicine";
import SaleForm from "../pages/sale/SaleForm";
import SaleHistory from "../pages/sale/SaleHistory";
import FormDropDown from "../pages/utility/FormDropDown";
import CustomerHistory from "../pages/user/CustomerHistory";
import CustomerList from "../pages/user/CustomerList";
import UserProfiles from "../pages/UserProfiles";
import StrengthDropDown from "../pages/utility/StrengthDropDown";
import SuperAdminDashboard from "../admin/pages/Dashboard/SuperAdminDashboard";
import HospitalList from "../admin/pages/hospitals/HospitalList";
import HospitalForm from "../admin/pages/hospitals/HospitalForm";
import UpdateHospital from "../admin/pages/hospitals/UpdateHospital";
import PharmacyDetails from "../admin/pages/hospitals/PharmacyDetails";
import UserList from "../pages/user/UserList";
import UserCreate from "../pages/user/UserCreate";
import UserUpdate from "../pages/user/UserUpdate";
import SubscriptionPlan from "../pages/subscription/SubscriptionPlan";
import InquiryList from "../pages/inquiry/InquiryList";

export const authRoutes = [
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> }
  ];
  
  export const protectedRoutes = [
    { path: "/", element: <Home />,params:[] },
    { path: "/medicine/items",params:[], element: <MedicineList /> },
    { path: "/medicine/items/:id/edit",params:["id"], element: <UpdateMedicineForm /> },
    { path: "/medicine/items/add",params:[], element: <CreateMedicineForm /> },
    { path: "/sale",params:[], element: <SaleHistory /> },
    { path: "/sale/add",params:[], element: <SaleForm /> },
    { path: "/medicine/inventory",params:[], element: <Stock /> },
    { path: "/medicine/inventory/:id/add-update",params:["id"], element: <UpdateStock /> },
    { path: "/medicine/inventory/:id/add",params:[], element: <AddStock /> },
    { path: "/customer/:id/purchase-history",params:["id"], element: <CustomerHistory /> },
    { path: "/customer-list",params:[], element: <CustomerList /> },
    { path: "/profile",params:[], element: <UserProfiles /> },
    { path: "/subscription/:offerId",params:["offerId"], element: <SubscriptionPlan /> },



    { path: "/admin/dashboard",params:[], element: <SuperAdminDashboard /> },

    
    { path: "/admin/strength",params:[], element: <StrengthDropDown /> },
    { path: "/admin/form",params:[], element: <FormDropDown /> },
    { path: "/admin/pharmacy/items",params:[], element: <HospitalList /> },
    { path: "/admin/pharmacy/items/add",params:[], element: <HospitalForm /> },
    { path: "/admin/pharmacy/items/:id/edit",params:[], element: <UpdateHospital /> },
    { path: "/admin/pharmacy/items/:id",params:[], element: <PharmacyDetails /> },


    { path: "/admin/users/items",params:[], element: <UserList /> },
    { path: "/admin/users/items/add",params:[], element: <UserCreate /> },
    { path: "/admin/users/items/:id/edit",params:[], element: <UserUpdate /> },
    // { path: "/admin/users/items/:id",params:[], element: <PharmacyDetails /> }

    { path: "/admin/inquiry/items",params:[], element: <InquiryList /> },
  ];