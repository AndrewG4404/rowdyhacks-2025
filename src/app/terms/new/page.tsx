'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useTermsSummary } from '@/lib/hooks';
import { apiClient } from '@/lib/api-client';

export default function CreateTermsPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const { generateSummary, isLoading: isGeneratingSummary, data: summaryData } = useTermsSummary();
  
  const [formData, setFormData] = useState({
    title: '',
    interestPercent: '0',
    cadence: 'monthly' as 'weekly' | 'biweekly' | 'monthly' | 'quarterly',
    graceDays: '7',
    collateralText: '',
    remedies: '',
    disclaimers: 'Non-legal template for educational use only. Not enforceable. Simulated currency.',
    locality: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreviewSummary = async () => {
    if (!formData.title) {
      setError('Title is required for preview');
      return;
    }

    try {
      setError('');
      const termsData = {
        title: formData.title,
        interestPercent: parseFloat(formData.interestPercent) || 0,
        cadence: formData.cadence,
        graceDays: parseInt(formData.graceDays) || 0,
        collateralText: formData.collateralText || undefined,
        remedies: formData.remedies || undefined,
        disclaimers: formData.disclaimers || undefined,
        locality: formData.locality || undefined,
      };

      await generateSummary(termsData);
      setShowSummary(true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate preview');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      setError('Please login to create terms');
      return;
    }

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess(false);

    try {
      const termsData = {
        title: formData.title,
        interestPercent: parseFloat(formData.interestPercent) || 0,
        cadence: formData.cadence,
        graceDays: parseInt(formData.graceDays) || 0,
        collateralText: formData.collateralText || undefined,
        remedies: formData.remedies || undefined,
        disclaimers: formData.disclaimers || undefined,
        locality: formData.locality || undefined,
      };

      await apiClient.createTerms(token, termsData);
      
      setSuccess(true);
      
      // Redirect to terms list after 2 seconds
      setTimeout(() => {
        router.push('/terms');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create terms');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Please login to create terms</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          🤖 Create Terms Template
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Generate AI-powered contract terms for your pledges
        </p>
      </div>

      {success && (
        <div style={{ 
          background: '#d1fae5', 
          border: '1px solid #6ee7b7', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          color: '#065f46'
        }}>
          ✅ Terms created successfully! Redirecting...
        </div>
      )}

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
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="e.g., Standard Community Contract - 5% Monthly"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Interest Rate (%)
              </label>
              <input
                type="number"
                name="interestPercent"
                value={formData.interestPercent}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="0"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Repayment Schedule
              </label>
              <select
                name="cadence"
                value={formData.cadence}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Grace Period (days)
            </label>
            <input
              type="number"
              name="graceDays"
              value={formData.graceDays}
              onChange={handleChange}
              min="0"
              max="365"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="7"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Collateral Description
            </label>
            <textarea
              name="collateralText"
              value={formData.collateralText}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="Describe any collateral (symbolic only, for educational purposes)"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Remedies
            </label>
            <textarea
              name="remedies"
              value={formData.remedies}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="Steps to take if repayment is not made (e.g., pause contributions, mediation, repayment plan adjustment)"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Disclaimers
            </label>
            <textarea
              name="disclaimers"
              value={formData.disclaimers}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Locality
            </label>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              maxLength={100}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="e.g., San Antonio, TX, USA"
            />
          </div>

          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #fde047', 
            borderRadius: '8px', 
            padding: '15px',
            marginTop: '20px'
          }}>
            <p style={{ color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>
              <strong>📝 Note:</strong> Our AI will generate a plain-language contract based on your inputs.
            </p>
            <p style={{ color: '#92400e', fontSize: '14px' }}>
              This process may take 10-30 seconds.
            </p>
          </div>
        </div>

        {showSummary && summaryData && (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '30px',
            marginBottom: '20px',
            border: '2px solid #10b981'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#10b981', 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🤖 AI-Generated Summary Preview
            </h3>
            <div style={{ 
              background: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: '8px', 
              padding: '20px',
              marginBottom: '15px'
            }}>
              <p style={{ 
                color: '#166534', 
                fontSize: '16px', 
                lineHeight: '1.6',
                margin: 0
              }}>
                {summaryData.summary}
              </p>
            </div>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px', 
              fontStyle: 'italic',
              margin: 0
            }}>
              This is a user-friendly summary of your contract terms. The full legal document will be more detailed and professional.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="button"
            onClick={handlePreviewSummary}
            disabled={isGeneratingSummary || isGenerating}
            style={{
              padding: '14px 20px',
              background: isGeneratingSummary ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (isGeneratingSummary || isGenerating) ? 'not-allowed' : 'pointer'
            }}
          >
            {isGeneratingSummary ? '🤖 Generating Preview...' : '👁️ Preview Summary'}
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            style={{
              flex: 1,
              padding: '14px',
              background: isGenerating ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? '🤖 Generating with AI...' : '✨ Generate Terms'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/terms')}
            disabled={isGenerating}
            style={{
              padding: '14px 30px',
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

