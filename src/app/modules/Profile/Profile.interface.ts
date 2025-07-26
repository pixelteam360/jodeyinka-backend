export type TProfile = {
  id: string;
  driverCanHire: number;
  paymentAmount: number;
  paymentId?: string | null;
  companyName: string;
  fullName: string;
  address: string;
  state: string;
  city: string;
  country: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  phoneNumber: string;
  salaryRange: string;
  typeOfVehicleOwned: string;
  hiredDriverBefore: boolean;
  driverPaymentMethod: string;
  driverGiniPaymentMethod: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  reference: string[];
};

export type TDriverProfile = {
  id: string;
  fullName: string;
  address: string;
  state: string;
  city: string;
  country: string;
  gender: string;
  age: number;
  dateOfBirth: string; // ISO 8601 string
  drivingLicense: string;
  typeOfVehicle: string;
  salaryRange: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  monthlyRate: string;
  reference: string[];
};
