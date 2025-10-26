'use client';

import { useWallet, useTransactions, useAuth } from '@/lib/hooks';

export default function WalletPage() {
  const { isAuthenticated } = useAuth();
  const { data: walletData, isLoading: walletLoading, error: walletError } = useWallet();
  const { data: transactionsData, isLoading: transLoading, error: transError } = useTransactions();
  
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Please login to view your wallet</p>
      </div>
    );
  }

  const balance = walletData?.account?.balanceGLM || 0;
  const transactions = transactionsData?.items || [];
  
  const formatAmount = (direction: string, amount: number) => {
    return direction === 'credit' ? `+${amount}` : `-${amount}`;
  };

  const getTransactionColor = (direction: string) => {
    return direction === 'credit' ? 'green' : 'red';
  };

  const getTransactionLabel = (refType: string, direction: string) => {
    if (refType === 'pledge') {
      return direction === 'debit' ? 'Pledge Made' : 'Pledge Received';
    }
    if (refType === 'transfer') {
      return direction === 'debit' ? 'Transfer Sent' : 'Transfer Received';
    }
    if (refType === 'repayment') {
      return direction === 'debit' ? 'Repayment Sent' : 'Repayment Received';
    }
    return direction === 'credit' ? 'Credit' : 'Debit';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          💳 Wallet
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Manage your GLM credits and view transaction history
        </p>
      </div>
      
      {walletError && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          color: '#991b1b'
        }}>
          <strong>Error loading wallet:</strong> {walletError.message}
        </div>
      )}

      {walletLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '20px' }}>
          Loading wallet...
        </div>
      ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Your Balance</p>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px' }}>
            {balance.toLocaleString()}{' '}
            <span style={{ fontSize: '24px' }}>GLM</span>
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            ⚠️ Simulated currency for demo purposes only
          </p>
        </div>
      )}
      
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
          Transaction History
        </h2>
        
        {transError && (
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px',
            color: '#991b1b'
          }}>
            <strong>Error loading transactions:</strong> {transError.message}
          </div>
        )}

        {transLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          <div>
            {transactions.map((tx: any) => {
              const color = getTransactionColor(tx.direction);
              const isCredit = tx.direction === 'credit';
              
              return (
                <div 
                  key={tx.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '5px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        background: color === 'green' ? '#d1fae5' : '#fee2e2',
                        color: color === 'green' ? '#065f46' : '#991b1b',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {isCredit ? 'Credit' : 'Debit'}
                      </span>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                      {getTransactionLabel(tx.refType, tx.direction)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      Ref: {tx.refType} • ID: {tx.refId.substring(0, 8)}...
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      color: color === 'green' ? '#059669' : '#dc2626'
                    }}>
                      {formatAmount(tx.direction, tx.amountGLM)} GLM
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <p style={{ marginBottom: '8px' }}>No transactions yet</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
