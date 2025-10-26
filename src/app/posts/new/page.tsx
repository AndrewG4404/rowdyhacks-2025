'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useAuth } from '@/lib/hooks';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useUser();
  const { token, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'medical',
    goalGLM: '',
    acceptContracts: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'medical', label: 'Medical' },
    { value: 'funeral', label: 'Funeral' },
    { value: 'fun', label: 'For Fun' },
    { value: 'vet', label: 'Vet Bills' },
    { value: 'education', label: 'Education' },
    { value: 'community', label: 'Community Projects' },
    { value: 'other', label: 'Other' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      setError('Please login to create a post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goalGLM: formData.goalGLM ? parseInt(formData.goalGLM) : undefined,
        acceptContracts: formData.acceptContracts
      };

      // Call YOUR backend API with authentication
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      
      if (response.ok && result.id) {
        // Redirect to the new post
        router.push(`/posts/${result.id}`);
      } else {
        setError(result.error?.message || 'Failed to create post');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to create a post.</p>
          <Link
            href="/api/auth/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Funding Request</h1>
          <p className="text-gray-600 mt-2">Share your story and funding goal with the community</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What do you need funding for?"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  minLength={20}
                  maxLength={5000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell your story. What's your situation? How will the funds be used?"
                />
                <p className="mt-1 text-sm text-gray-500">{formData.description.length}/5000 characters</p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Goal Amount */}
              <div>
                <label htmlFor="goalGLM" className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Goal (GLM)
                </label>
                <input
                  type="number"
                  id="goalGLM"
                  name="goalGLM"
                  value={formData.goalGLM}
                  onChange={handleChange}
                  min="1"
                  max="1000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5000"
                />
                <p className="mt-1 text-sm text-gray-500">Optional - Set a target amount for your request</p>
              </div>

              {/* Accept Contracts */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptContracts"
                    name="acceptContracts"
                    type="checkbox"
                    checked={formData.acceptContracts}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptContracts" className="font-medium text-gray-700">
                    Accept contract pledges
                  </label>
                  <p className="text-gray-500">Allow sponsors to attach custom terms with their pledges</p>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This platform uses simulated currency (GLM credits) for demonstration purposes only. 
                        No real money transactions occur. This is not financial or legal advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/explore')}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
