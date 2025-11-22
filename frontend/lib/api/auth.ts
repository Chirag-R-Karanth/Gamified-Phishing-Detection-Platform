const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  department?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      department: string;
      level: number;
      xp: number;
    };
    token: string;
  };
}

// Register new user
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Registration failed');
  }

  return result;
}

// Login user
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }

  return result;
}

// Get user profile
export async function getUserProfile(token: string) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch profile');
  }

  return result;
}

export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch profile');
  }

  return result;
}