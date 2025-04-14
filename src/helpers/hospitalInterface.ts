export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    landmark?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
  
  export interface IContact {
    phone: string;
    whatsapp?: string;
    email: string;
    website?: string;
  }
  
  export interface IDoctor {
    name: string;
    degree: string;
    department: string;
    experience: string;
  }
  
  export interface IOperationalDetails {
    openDays: string[];  // e.g., ['Monday', 'Tuesday', ...]
    openTime: string;    // e.g., '09:00 AM'
    closeTime: string;   // e.g., '06:00 PM'
    emergencyAvailable: boolean;
    is24x7: boolean;
  }
  
  export interface IStaffCount {
    
    doctors: number,
    nurses: number,
    technicians: number,
    otherStaff: number,
  }
  
  export interface IDocument {
    registrationCertificate?: string;
    gstCertificate?: string;
    ownerIdProof?: string;
  }
  
  export interface IMedia {
    logo?: string;
    photos: string[];
    videos: string[];
  }
  
  export interface IBankDetails {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  }
  
  export interface IHospital {
    _id:string,
    name: string;
    type: string;
    ownerName: string;
    registrationNumber: string;
    yearEstablished: number;
  
    address: IAddress;
    contact: IContact;
    doctor: IDoctor;
    operationalDetails: IOperationalDetails;
  
    servicesOffered: string[];
    departments: string[];
    homeCollection: boolean;
    onlineBooking: boolean;
  
    staffCount: IStaffCount;
  
    documents: IDocument;
  
    media: IMedia;
  
    bankDetails?: IBankDetails;
    branchCode?: string;

    doctors:string[];
    
  
    createdAt?: Date;
    updatedAt?: Date;
  }
  