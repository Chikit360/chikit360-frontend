import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {

  BoxIcon,

  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,

  ListIcon,

  LockIcon,

  MedicineIcon,
  PieChartIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useSelector } from "react-redux";
import { getUserRole } from "../features/auth/user.slice";
import { RootState } from "../features/store";
import { Modal } from "../components/ui/modal";
import { ExtraAddOn } from "../helpers/offerPlanInterface";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean, role?: string[] }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Home",
    subItems: [{ name: "Dashboard", path: "/", pro: false }, { name: "Profile", path: "/profile", pro: false },],
  },
  {
    icon: <MedicineIcon />,
    name: "Medicine",
    subItems: [{ name: "Items", path: "/medicine/items", pro: false }, { name: "Inventory", path: "/medicine/inventory", pro: false }],
  },
  {
    icon: <BoxIcon />,
    name: "Sale",
    subItems: [{ name: "Sale List", path: "/sale", pro: false }, { name: "Customer", path: "/customer-list", pro: false },],
  },

];
const superAdminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Home",
    subItems: [{ name: "Dashboard", path: "/admin/dashboard", pro: false }],
  },
  {
    icon: <MedicineIcon />,
    name: "Pharmacy",
    subItems: [{ name: "Items", path: "/admin/pharmacy/items", pro: false }],
  },
  {
    icon: <ListIcon />,
    name: "Inquiry",
    subItems: [{ name: "Items", path: "/admin/inquiry/items", pro: false }],
  },
  {
    icon: <ListIcon />,
    name: "Offers",
    subItems: [{ name: "Items", path: "/admin/offers-plan/items", pro: false }],
  },



];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Utility",
    subItems: [
      { name: "Strength", path: "/admin/strength", role: ["admin"], pro: false },
      { name: "Form", path: "/admin/form", role: ["admin"], pro: false },
      { name: "User", path: "/admin/users/items", role: ["admin"], pro: false },
    ],
  },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const userRole = useSelector(getUserRole)
  const [openBox, setOpenBox] = useState(false)
  const { data: subscriptionData } = useSelector(((state: RootState) => state.subscription))
  const {plans  } = useSelector(((state: RootState) => state.offerPlan))
 

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? userRole === 'superAdmin' ? superAdminNavItems : navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // const handleSubscriptionClick = () => {
  //   if (!subscriptionData?.isActive) {
  //     // Open subscription modal or redirect to subscription page
  //     console.log("Open subscription modal or redirect to subscription page");
  //   }
  // };
 
  
  

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button

              onClick={() =>userRole==="superAdmin"?handleSubmenuToggle(index, menuType):subscriptionData?.isActive ? handleSubmenuToggle(index, menuType) : setOpenBox(true)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {userRole==="superAdmin"? nav.icon: subscriptionData?.isActive ? nav.icon : <LockIcon />}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.filter((subItem) => !subItem.role || subItem.role.includes(userRole!)).map((subItem) => (
                  <button className="block w-full disabled:cursor-not-allowed" disabled={userRole==="superAdmin"? false: subscriptionData?.isActive ? false : true}  key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </button>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/ThunderGits_Logos/1.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/ThunderGits_Logos/2.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <>
              <img
                className="block dark:hidden"
                src="/images/logo/ThunderGits_Logos/3.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/ThunderGits_Logos/4.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(userRole === 'superAdmin' ? superAdminNavItems : navItems, "main")}
            </div>
            {
              othersItems
                .some(
                  (item) =>
                    item.subItems &&
                    item.subItems.some((sub) => sub.role?.includes(userRole!))
                ) && (
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
                  </h2>
                  {renderMenuItems(othersItems, "others")}
                </div>
              )
            }

          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
      
    </aside>
    <Modal className="w-full max-w-6xl" isOpen={openBox} onClose={() => setOpenBox(false)}>
  <div className="p-6 h-[90vh] flex flex-col">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 shrink-0">Choose Your Plan</h2>

    <div className="overflow-y-auto flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <div
            key={plan._id}
            className={`flex flex-col justify-between h-full w-full rounded-2xl p-6 shadow-xl transition-transform duration-300 transform hover:-translate-y-1 bg-white border-t-8 ${plan.color}`}
          >
            <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-4 min-h-[50px]">{plan.description}</p>

            <div className="text-lg font-semibold text-gray-700 mb-2">
              ₹{plan.price} / {plan.validityInDays >= 30 ? `${plan.validityInDays / 30} month${plan.validityInDays > 30 ? "s" : ""}` : `${plan.validityInDays} days`}
            </div>
            <div>
            Initial set-up cost: ₹{plan.initialSetUpPrice}
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600">Limits:</h4>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>Users: {plan.limits?.userLimit}</li>
                <li>Departments: {plan.limits?.departmentLimit}</li>
                <li>Medicines: {plan.limits?.medicineLimit}</li>
                <li>Sales/day: {plan.limits?.saleLimitPerDay}</li>
              </ul>
            </div>

            {plan.features?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600">Features:</h4>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={feature.isEnabled ? "text-green-600" : "text-red-500"}>
                      {feature.label} – {feature.isEnabled ? "Enabled" : "Disabled"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>
          
       


            <button
              className={`w-full mt-4 py-2 rounded-md text-white font-medium bg-gray-800 hover:bg-gray-900 transition`}
              onClick={() => {
                setOpenBox(false);
                window.location.href = `/subscription/${plan._id}`;
              }}
            >
              Explore Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
</Modal>


    </>
  );
};

export default AppSidebar;
