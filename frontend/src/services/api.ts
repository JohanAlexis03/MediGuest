import { Platform } from 'react-native';
import Constants from 'expo-constants';

export class ApiError extends Error {
  status: number;
  error: string;
  catUrl: string;
  path?: string;
  timestamp?: string;

  constructor(
    status: number,
    error: string,
    message: string,
    catUrl: string,
    path?: string,
    timestamp?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.catUrl = catUrl;
    this.path = path;
    this.timestamp = timestamp;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Obtiene la IP de la máquina anfitriona para permitir que dispositivos móviles
 * físicos conectados por Wi-Fi alcancen el backend de Spring Boot (puerto 8080).
 */
const getDevHost = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }
  return '192.168.1.137';
};

const DEV_HOST = Platform.OS === 'web' ? 'localhost' : getDevHost();

const DEFAULT_BASE_URL = Platform.select({
  web: 'http://localhost:8080/api',
  default: `http://${DEV_HOST}:8080/api`,
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanEndpoint = normalizedEndpoint.startsWith('/api/')
    ? normalizedEndpoint.replace(/^\/api/, '')
    : normalizedEndpoint;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let parsedError: Partial<ApiError> = {};
      try {
        parsedError = await response.json();
      } catch {
        // Body no era JSON
      }

      const status = response.status;
      throw new ApiError(
        status,
        parsedError.error || response.statusText || 'Error de API',
        parsedError.message || `Ocurrió un error en la solicitud (${status})`,
        parsedError.catUrl || `https://http.cat/${status}.jpg`,
        parsedError.path || endpoint,
        parsedError.timestamp || new Date().toISOString()
      );
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Error de red / offline
    throw new ApiError(
      503,
      'Servidor no disponible',
      'No fue posible conectar con el servidor de MediQuest. Verifica tu conexión a internet o el backend.',
      'https://http.cat/503.jpg',
      endpoint,
      new Date().toISOString()
    );
  }
}
