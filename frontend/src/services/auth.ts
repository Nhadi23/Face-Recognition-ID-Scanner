export interface LoginResponse {
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  if (username === "admin" && password === "123456") {
    return { token: "dummy-token" };
  }

  throw new Error("Username atau password salah");
};
