// export interface LoginResponse {
//   token: string;
// }

// export const login = async (
//   username: string,
//   password: string
// ): Promise<LoginResponse> => {
//   if (username === 'admin' && password === '123456') {
//     return { token: 'dummy-token' };
//   }

//   throw new Error('Username atau password salah');
// };

import api from './api';

export type Role = 'admin' | 'student';

export interface LoginResponse {
  accessToken: string;
  role: Role;
  user: {
    id: number;
    nama: string;
    nim: string;
    role: Role;
  };
  refreshToken?: string;
  message?: string;
}

export async function login(
  nim: string,
  password: string
): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/api/user/login', {
    nim,
    password,
  });
  return res.data;
}

export async function logout() {
  try {
    await api.post('/api/user/logout');
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.removeItem('accessToken');
  }
}
