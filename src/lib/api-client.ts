// API Client - Centralized fetch wrapper for GoLoanMe API
// Handles authentication, error handling, and request formatting

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  idempotencyKey?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, idempotencyKey, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: { 
            code: 'UNKNOWN_ERROR', 
            message: response.statusText 
          } 
        }));
        
        throw new ApiError(
          response.status,
          errorData.error?.code || 'UNKNOWN_ERROR',
          errorData.error?.message || 'An error occurred',
          errorData.error?.details
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'NETWORK_ERROR', 'Network request failed');
    }
  }

  // Health
  async health() {
    return this.request<{ status: string; version: string; timestamp: string; uptime: number }>('/api/health');
  }

  // Auth & Users
  async getMe(token: string) {
    return this.request('/api/me', { token });
  }

  async updateMe(token: string, data: any) {
    return this.request('/api/me', {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    });
  }

  async getUserByHandle(handle: string) {
    return this.request(`/api/users/${handle}`);
  }

  // Posts
  async getPosts(params?: { q?: string; category?: string; status?: string; limit?: number; cursor?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/posts${query ? `?${query}` : ''}`);
  }

  async getPost(id: string) {
    return this.request(`/api/posts/${id}`);
  }

  async createPost(token: string, data: any, idempotencyKey?: string) {
    return this.request('/api/posts', {
      method: 'POST',
      token,
      idempotencyKey,
      body: JSON.stringify(data),
    });
  }

  async updatePost(token: string, id: string, data: any) {
    return this.request(`/api/posts/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    });
  }

  async deletePost(token: string, id: string) {
    return this.request(`/api/posts/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Pledges
  async getPledges(postId: string, params?: { limit?: number; cursor?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/posts/${postId}/pledges${query ? `?${query}` : ''}`);
  }

  async createPledge(token: string, postId: string, data: any, idempotencyKey?: string) {
    return this.request(`/api/posts/${postId}/pledges`, {
      method: 'POST',
      token,
      idempotencyKey,
      body: JSON.stringify(data),
    });
  }

  // Terms
  async getMyTerms(token: string) {
    return this.request('/api/terms/me', { token });
  }

  async getTerm(token: string, id: string) {
    return this.request(`/api/terms/${id}`, { token });
  }

  async createTerms(token: string, data: any, idempotencyKey?: string) {
    return this.request('/api/terms', {
      method: 'POST',
      token,
      idempotencyKey,
      body: JSON.stringify(data),
    });
  }

  // Wallet
  async getWallet(token: string) {
    return this.request('/api/wallet', { token });
  }

  async getTransactions(token: string, params?: { limit?: number; cursor?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/wallet/transactions${query ? `?${query}` : ''}`, { token });
  }

  // Admin
  async verifySponsor(token: string, handle: string) {
    return this.request(`/api/admin/users/${handle}/verify-sponsor`, {
      method: 'POST',
      token,
    });
  }
}

export const apiClient = new ApiClient();

