import { Platform } from 'react-native';

export interface ApiError {
  status: number;
  error: string;
  message: string;
  catUrl: string;
  path?: string;
  timestamp?: string;
}

const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  default: 'http://localhost:8080/api',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

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
      const apiError: ApiError = {
        status,
        error: parsedError.error || response.statusText || 'Error de API',
        message: parsedError.message || `Ocurrió un error en la solicitud (${status})`,
        catUrl: parsedError.catUrl || `https://http.cat/${status}.jpg`,
        path: parsedError.path || endpoint,
        timestamp: parsedError.timestamp || new Date().toISOString(),
      };

      throw apiError;
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if ((error as ApiError).status) {
      throw error as ApiError;
    }

    // Error de red / offline
    const networkError: ApiError = {
      status: 503,
      error: 'Servidor no disponible',
      message: 'No fue posible conectar con el servidor de MediQuest. Verifica tu conexión a internet o el backend.',
      catUrl: 'https://http.cat/503.jpg',
      path: endpoint,
      timestamp: new Date().toISOString(),
    };
    throw networkError;
  }
}
