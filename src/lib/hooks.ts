// Custom React hooks for GoLoanMe
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiClient } from './api-client';

export function useAuth() {
  const { user, isLoading: auth0Loading } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get access token from Auth0
  useEffect(() => {
    if (user) {
      // For demo purposes, we'll use a mock token
      // In production, you'd fetch the actual Access Token from Auth0
      setAccessToken('demo-token-' + user.sub);
    } else {
      setAccessToken(null);
    }
  }, [user]);

  return {
    token: accessToken,
    isAuthenticated: !!user,
    isLoading: auth0Loading,
    user,
    login: () => {
      window.location.href = '/api/auth/login';
    },
    logout: () => {
      window.location.href = '/api/auth/logout';
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
      if (!id) return;
      
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

  const refetch = () => {
    if (id) {
      apiClient.getPost(id).then(result => {
        setData(result);
        setError(null);
      }).catch(err => {
        setError(err);
      });
    }
  };

  return { data, isLoading, error, refetch };
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
      if (!token) return;
      
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
      if (!token) return;
      
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
      if (!token) return;
      
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
