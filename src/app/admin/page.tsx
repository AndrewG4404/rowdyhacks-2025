'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks';
import { apiClient } from '@/lib/api-client';

export default function AdminPage() {
  const { token, isAuthenticated } = useAuth();
  const [userHandle, setUserHandle] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleVerifySponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      setMessageType('error');
      setMessage('Please login to access admin features');
      return;
    }

    if (!userHandle) {
      setMessageType('error');
      setMessage('Please enter a user handle');
      return;
    }

    setIsVerifying(true);
    setMessage('');
    setMessageType('');

    try {
      await apiClient.verifySponsor(token, userHandle);
      
      setMessageType('success');
      setMessage(`Successfully toggled verified status for @${userHandle}`);
      setUserHandle('');
    } catch (err: any) {
      setMessageType('error');
      setMessage(err.message || 'Failed to verify sponsor');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Please login to access admin panel</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          🛡️ Admin Panel
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Platform administration and moderation tools
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Verify Sponsor Badge
        </h2>

        {message && (
          <div style={{ 
            background: messageType === 'success' ? '#d1fae5' : '#fee2e2', 
            border: `1px solid ${messageType === 'success' ? '#6ee7b7' : '#fecaca'}`, 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px',
            color: messageType === 'success' ? '#065f46' : '#991b1b'
          }}>
            {messageType === 'success' ? '✅' : '❌'} {message}
          </div>
        )}

        <form onSubmit={handleVerifySponsor}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              User Handle
            </label>
            <input
              type="text"
              value={userHandle}
              onChange={(e) => setUserHandle(e.target.value)}
              required
              pattern="^[a-zA-Z0-9_-]{3,30}$"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="e.g., sofia_ramirez"
            />
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Enter the handle of the user to toggle their verified sponsor badge
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            style={{
              width: '100%',
              padding: '14px',
              background: isVerifying ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isVerifying ? 'not-allowed' : 'pointer'
            }}
          >
            {isVerifying ? 'Processing...' : 'Toggle Verified Badge'}
          </button>
        </form>

        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #fde047', 
          borderRadius: '8px', 
          padding: '15px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#92400e', fontSize: '14px' }}>
            ℹ️ <strong>Note:</strong> This toggles the verified sponsor badge on/off. 
            If the user doesn't have a sponsor profile, one will be created automatically.
          </p>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Additional Admin Features
        </h2>
        <div style={{ color: '#6b7280' }}>
          <p style={{ marginBottom: '12px' }}>
            📊 <strong>Reports Dashboard:</strong> View and manage user reports (coming soon)
          </p>
          <p style={{ marginBottom: '12px' }}>
            🗑️ <strong>Content Moderation:</strong> Remove abusive posts and comments (coming soon)
          </p>
          <p style={{ marginBottom: '12px' }}>
            👥 <strong>User Management:</strong> View and manage user accounts (coming soon)
          </p>
          <p>
            📈 <strong>Platform Analytics:</strong> View funding statistics and trends (coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}

