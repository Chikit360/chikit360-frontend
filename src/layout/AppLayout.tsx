import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../features/store";
import { getAllMedicines } from "../features/medicine/medicineApi";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import { getAllHospitals } from "../features/hospitals/hospitalApi";
import { fetchDropdownOptions } from "../features/dropDown/dropDownApi";
import { fetchNotificationCount } from "../features/notifications/notificationApi";
import { getUserRole } from "../features/auth/user.slice";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 dark:text-white">
          <div>
            <Breadcrumb/>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userRole = useSelector(getUserRole);
  useEffect(() => {
    if(userRole==="superAdmin"){
      dispatch(getAllHospitals());   // Fetch Gender dropdown
    }else{
      dispatch(getAllMedicines());
      dispatch(fetchDropdownOptions("strength"));  // Fetch Category dropdown
      dispatch(fetchDropdownOptions("form"));   // Fetch Gender dropdown
      dispatch(fetchNotificationCount());   // Fetch Gender dropdown
    }
  
    
  }, [dispatch])
  
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
