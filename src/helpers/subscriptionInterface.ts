export interface SubscriptionI {
    _id?: string;
    hospital: string;
    plan: string;
    price: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isCancelled: boolean;
    paymentMethod: string;
    transactionId: string;
    subscriptionToken: string;
    createdAt?: string;
    updatedAt?: string;
  }
  