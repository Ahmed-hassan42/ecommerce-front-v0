export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface IAuthResponse {
  token: string;
}