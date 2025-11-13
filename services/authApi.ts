import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not configured. Please check your .env file.');
}
const TOKEN_KEY = '@safechem_auth_token';
const USER_KEY = '@safechem_user';

export interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface GoogleLoginData {
  googleId: string;
  email: string;
  fullName: string;
  picture?: string;
}

class AuthApiService {
  private token: string | null = null;
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds

  /**
   * Initialize the service by loading stored token
   */
  async initialize() {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  /**
   * Get authorization headers
   */
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Store authentication data
   */
  private async storeAuthData(authResponse: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, authResponse.token],
        [USER_KEY, JSON.stringify(authResponse.user)],
      ]);
      this.token = authResponse.token;
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const authResponse = await this.handleResponse<AuthResponse>(response);
      await this.storeAuthData(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Google login/signup
   */
  async googleLogin(data: GoogleLoginData): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const authResponse = await this.handleResponse<AuthResponse>(response);
      await this.storeAuthData(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  /**
   * Sign up new user
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const authResponse = await this.handleResponse<AuthResponse>(response);
      await this.storeAuthData(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Optional: Call logout endpoint if your API has one
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: this.getHeaders(true),
        }).catch(() => {
          // Ignore logout endpoint errors
        });
      }

      // Clear local storage
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      this.token = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken }),
      });

      const authResponse = await this.handleResponse<AuthResponse>(response);
      await this.storeAuthData(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });

      const user = await this.handleResponse<User>(response);
      
      // Update stored user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authApi = new AuthApiService();
