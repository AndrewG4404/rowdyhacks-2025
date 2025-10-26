// Custom React hooks for GoLoanMe
'use client';

import { useState, useEffect } from 'react';
import { apiClient, ApiError } from './api-client';

// Mock token for development (replace with Auth0 in production)
const MOCK_TOKEN = 'dev_token_12345';

export function useAuth() {
  // TODO: Replace with Auth0 useAuth hook
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Mock auth for development
    setToken(MOCK_TOKEN);
    setIsLoading(false);
  }, []);

  return {
    token,
    isAuthenticated: !!token,
    isLoading,
    user,
    login: () => {
      // TODO: Implement Auth0 login
      setToken(MOCK_TOKEN);
    },
    logout: () => {
      // TODO: Implement Auth0 logout
      setToken(null);
    },
  };
}

export function usePosts(params?: { q?: string; category?: string; status?: string }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPosts() {
      try {
        setIsLoading(true);
        const result = await apiClient.getPosts(params);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [params?.q, params?.category, params?.status]);

  return { data, isLoading, error };
}

export function usePost(id: string | null) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function fetchPost() {
      try {
        setIsLoading(true);
        const result = await apiClient.getPost(id);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, isLoading, error, refetch: () => {} };
}

export function useWallet() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function fetchWallet() {
      try {
        setIsLoading(true);
        const result = await apiClient.getWallet(token);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchWallet();

    return () => {
      mounted = false;
    };
  }, [token]);

  return { data, isLoading, error };
}

export function useMyTerms() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function fetchTerms() {
      try {
        setIsLoading(true);
        const result = await apiClient.getMyTerms(token);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTerms();

    return () => {
      mounted = false;
    };
  }, [token]);

  return { data, isLoading, error };
}

export function useTransactions() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function fetchTransactions() {
      try {
        setIsLoading(true);
        const result = await apiClient.getTransactions(token);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTransactions();

    return () => {
      mounted = false;
    };
  }, [token]);

  return { data, isLoading, error };
}

