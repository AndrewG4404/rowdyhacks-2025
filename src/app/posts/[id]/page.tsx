'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePost, useAuth, useMyTerms } from '@/lib/hooks';
import { apiClient } from '@/lib/api-client';

const categoryLabels: Record<string, string> = {
  medical: 'Medical',
  funeral: 'Funeral',
  fun: 'For Fun',
  vet: 'Vet Bills',
  education: 'Education',
  community: 'Community Projects',
  other: 'Other'
};

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: post, isLoading, error, refetch } = usePost(id);
  const { token, isAuthenticated } = useAuth();
  const { data: myTerms } = useMyTerms();
  
  const [pledgeType, setPledgeType] = useState<'donation' | 'contract'>('donation');
  const [amount, setAmount] = useState('');
  const [selectedTermsId, setSelectedTermsId] = useState('');
  const [note, setNote] = useState('');
  const [isPledging, setIsPledging] = useState(false);
  const [pledgeError, setPledgeError] = useState('');
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      setPledgeError('Please login to make a pledge');
      return;
    }

    if (!amount || parseInt(amount) < 1) {
      setPledgeError('Amount must be at least 1 GLM');
      return;
    }

    if (pledgeType === 'contract' && !selectedTermsId) {
      setPledgeError('Please select terms for contract pledge');
      return;
    }

    setIsPledging(true);
    setPledgeError('');
    setPledgeSuccess(false);

    try {
      const pledgeData = {
        type: pledgeType,
        amountGLM: parseInt(amount),
        termsId: pledgeType === 'contract' ? selectedTermsId : undefined,
        note: note || undefined,
      };

      await apiClient.createPledge(token, id, pledgeData);
      
      setPledgeSuccess(true);
      setAmount('');
      setNote('');
      setSelectedTermsId('');
      
      // Refresh post data
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (err: any) {
      setPledgeError(err.message || 'Failed to create pledge');
    } finally {
      setIsPledging(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '8px', color: '#991b1b' }}>
          <strong>Error:</strong> {error?.message || 'Post not found'}
        </div>
        <Link href="/explore" style={{ display: 'inline-block', marginTop: '20px', color: '#2563eb' }}>
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const fundedGLM = post.stats?.fundedGLM || 0;
  const goalGLM = post.goalGLM || 0;
  const percentFunded = goalGLM > 0 ? Math.min((fundedGLM / goalGLM) * 100, 100) : 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/explore" style={{ display: 'inline-block', marginBottom: '20px', color: '#2563eb', textDecoration: 'none' }}>
        ← Back to Explore
      </Link>

      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
          <span style={{ 
            padding: '4px 12px', 
            background: '#dbeafe', 
            color: '#1e40af',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {categoryLabels[post.category] || post.category}
          </span>
          <span style={{ 
            padding: '4px 12px', 
            background: post.status === 'open' ? '#d1fae5' : '#e5e7eb', 
            color: post.status === 'open' ? '#065f46' : '#6b7280',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {post.status === 'open' ? 'Open' : 'Closed'}
          </span>
          {post.acceptContracts && (
            <span style={{ fontSize: '14px', color: '#6b7280' }}>📝 Accepts contract pledges</span>
          )}
          <span style={{ color: '#6b7280', marginLeft: 'auto' }}>
            by @{post.owner?.handle || 'unknown'}
          </span>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Description</h2>
        <p style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {post.description}
        </p>
      </div>

      {goalGLM > 0 && (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Funding Progress</h2>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Raised: {fundedGLM.toLocaleString()} GLM</span>
              <span style={{ color: '#6b7280' }}>Goal: {goalGLM.toLocaleString()} GLM</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: '#e5e7eb', 
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${percentFunded}%`, 
                height: '100%', 
                background: '#10b981',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginTop: '15px' }}>
            {percentFunded.toFixed(0)}% funded
          </p>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#6b7280' }}>
            {post.stats?.donors || 0} donor{(post.stats?.donors || 0) !== 1 ? 's' : ''} • {post.stats?.sponsors || 0} sponsor{(post.stats?.sponsors || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {post.status === 'open' && (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '30px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Make a Pledge</h2>
          
          {pledgeSuccess && (
            <div style={{ 
              background: '#d1fae5', 
              border: '1px solid #6ee7b7', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px',
              color: '#065f46'
            }}>
              ✅ Pledge successful! Thank you for your contribution.
            </div>
          )}

          {pledgeError && (
            <div style={{ 
              background: '#fee2e2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px',
              color: '#991b1b'
            }}>
              ❌ {pledgeError}
            </div>
          )}

          {!isAuthenticated && (
            <div style={{ 
              background: '#fef3c7', 
              border: '1px solid #fde047', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px',
              color: '#92400e'
            }}>
              ℹ️ Please login to make a pledge
            </div>
          )}
          
          <form onSubmit={handlePledgeSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Pledge Type
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPledgeType('donation')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: pledgeType === 'donation' ? '#2563eb' : 'white',
                    color: pledgeType === 'donation' ? 'white' : '#374151',
                    border: `2px solid ${pledgeType === 'donation' ? '#2563eb' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  💰 Donation
                </button>
                {post.acceptContracts && (
                  <button
                    type="button"
                    onClick={() => setPledgeType('contract')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: pledgeType === 'contract' ? '#2563eb' : 'white',
                      color: pledgeType === 'contract' ? 'white' : '#374151',
                      border: `2px solid ${pledgeType === 'contract' ? '#2563eb' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Contract Pledge
                  </button>
                )}
              </div>
            </div>

            {pledgeType === 'contract' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Select Terms Template *
                </label>
                {myTerms && myTerms.length > 0 ? (
                  <select
                    value={selectedTermsId}
                    onChange={(e) => setSelectedTermsId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">-- Select terms --</option>
                    {myTerms.map((terms: any) => (
                      <option key={terms.id} value={terms.id}>
                        {terms.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ padding: '15px', background: '#fef3c7', borderRadius: '8px', color: '#92400e' }}>
                    You need to <Link href="/terms" style={{ color: '#2563eb', fontWeight: 'bold' }}>create terms</Link> first
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Amount (GLM) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="Enter amount"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="Leave a message..."
              />
            </div>

            <button
              type="submit"
              disabled={isPledging || !isAuthenticated || (pledgeType === 'contract' && !selectedTermsId)}
              style={{
                width: '100%',
                padding: '14px',
                background: (isPledging || !isAuthenticated || (pledgeType === 'contract' && !selectedTermsId)) ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (isPledging || !isAuthenticated || (pledgeType === 'contract' && !selectedTermsId)) ? 'not-allowed' : 'pointer'
              }}
            >
              {isPledging ? 'Processing...' : `Make ${pledgeType === 'donation' ? 'Donation' : 'Contract Pledge'}`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
