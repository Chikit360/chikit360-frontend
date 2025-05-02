export interface SchemeI {
    price: number;
    validityInDays: number;
    discount?: number;
  }
export interface FeatureI {
    key?: string;
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

  export interface ExtraAddOn{
    title:string,
    price:number,
  }
  
  export interface OfferPlanI {
    _id: string;
    color: string;
    name: string;
    scheme: SchemeI[];
    description?: string;
    features: FeatureI[];
    limits: Limits;
    initialSetUpPrice:number,
    extraAddOn:ExtraAddOn[],
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
  }
  