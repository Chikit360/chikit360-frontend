export interface InquiryI {
    _id: string;
    name: string;
    email: string;
    contactNumber: string;
    message: string;
    status: 'pending' | 'resolved';
    createdAt?: string;
    updatedAt?: string;
  }