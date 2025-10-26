'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { apiClient } from '@/lib/api-client';

export default function CreatePostPage() {
  const router = useRouter();
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

      const result = await apiClient.createPost(token, postData);
      
      // Redirect to the new post
      router.push(`/posts/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Please login to create a post</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          📝 Create Post
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Share your funding request with the community
        </p>
      </div>

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          color: '#991b1b'
        }}>
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '30px',
          marginBottom: '20px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={100}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="e.g., Help with emergency surgery costs"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={5000}
              rows={6}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical'
              }}
              placeholder="Tell your story and why you need help..."
            />
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', textAlign: 'right' }}>
              {formData.description.length} / 5000 characters
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Goal Amount (GLM)
            </label>
            <input
              type="number"
              name="goalGLM"
              value={formData.goalGLM}
              onChange={handleChange}
              min="1"
              max="1000000"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="e.g., 5000"
            />
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Optional - Set a target amount for your request
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'start', marginBottom: '20px' }}>
            <input
              type="checkbox"
              id="acceptContracts"
              name="acceptContracts"
              checked={formData.acceptContracts}
              onChange={handleChange}
              style={{ 
                marginRight: '10px', 
                marginTop: '4px',
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="acceptContracts" style={{ color: '#374151', flex: 1, cursor: 'pointer' }}>
              <strong>Accept contract pledges (with terms)</strong>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Allow contributors to make contract-backed pledges with custom repayment terms
              </div>
            </label>
          </div>

          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #fde047', 
            borderRadius: '8px', 
            padding: '15px',
            marginTop: '20px'
          }}>
            <p style={{ color: '#92400e', fontSize: '14px' }}>
              ⚠️ <strong>Reminder:</strong> This is a simulated currency platform for demo purposes. 
              No real money will be exchanged.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '14px',
              background: isSubmitting ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/explore')}
            disabled={isSubmitting}
            style={{
              padding: '14px 30px',
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
