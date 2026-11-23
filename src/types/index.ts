export type Vendor = {
  name: string;
  image: string | null;
  businessName: string | null;
  isPremium: boolean;
};

export type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  vendor?: Vendor | null;
};
export type Person = {
  name: string;
  email: string;
  image: string | null;
  businessName: string | null;
};

export type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  service: {
    _id: string;
    serviceName: string;
    category: string;
    price: number;
    location: string;
    image: string | null;
  } | null;
  vendor: Person | null;
  customer: Person | null;
};
