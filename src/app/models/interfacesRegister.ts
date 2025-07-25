export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  companyName?: string;
  siretSiren?: string;
}

export interface ApiConfig {
  url: string;
  payload: RegisterPayload;
}