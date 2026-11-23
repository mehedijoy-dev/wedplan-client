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
