export interface LoginResponse {
  token: string;
  userRole: string;
  [key: string]: any;
}

export interface LoginPayload {
  email: string;
  password: string;
}