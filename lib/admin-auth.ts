import { api } from "./api";

export const ADMIN_SESSION_KEY = "entraide-admin-token";

export type MockAdminSession = {
  email: string;
  loggedInAt: string;
};

export async function checkAdminSession(): Promise<boolean> {
  try {
    const user = await api.getMe();
    return !!user;
  } catch {
    return false;
  }
}

export async function adminLogin(email: string, password: string): Promise<boolean> {
  try {
    await api.login(email, password);
    return true;
  } catch {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  await api.logout();
}
