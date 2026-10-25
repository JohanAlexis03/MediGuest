import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

const USER_SESSION_KEY = '@mediquest_user_session';

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const AuthService = {
  /**
   * Autenticación contra el backend en Spring Boot / MySQL (RF01)
   */
  async login(email: string, password: string): Promise<UserSession> {
    const user = await apiRequest<UserSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Registro de nuevo estudiante o docente en MySQL (RF02)
   */
  async register(name: string, email: string, password: string): Promise<UserSession> {
    const user = await apiRequest<UserSession>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Obtiene la sesión activa persistida en el dispositivo
   */
  async getCurrentUser(): Promise<UserSession | null> {
    try {
      const json = await AsyncStorage.getItem(USER_SESSION_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  /**
   * Cierra la sesión activa
   */
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(USER_SESSION_KEY);
  },
};
