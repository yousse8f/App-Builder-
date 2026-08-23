export type UserRole = "ADMIN" | "CLIENT";

export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";

export interface Client {
  id: string;
  companyName: string;
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  clientId?: string;
  client?: Client | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RefreshResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}