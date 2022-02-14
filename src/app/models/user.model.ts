export interface User {
  id: number;
  forenames: string;
  surname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
}