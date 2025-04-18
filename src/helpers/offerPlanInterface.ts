export interface Feature {
    key: string;
    label: string;
    description?: string;
    isEnabled: boolean;
  }
  
  export interface Limits {
    userLimit: number;
    departmentLimit: number;
    medicineLimit: number;
    saleLimitPerDay: number;
  }
  
  export interface OfferPlanI {
    _id: string;
    color: string;
    name: "free_trial" | "basic" | "standard" | "premium";
    price: number;
    validityInDays: number;
    description?: string;
    features: Feature[];
    limits: Limits;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
  }
  