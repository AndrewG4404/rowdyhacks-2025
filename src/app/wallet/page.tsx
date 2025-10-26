'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Account, LedgerEntry } from '@/types';

export default function WalletPage() {
  // Mock data for demonstration
  const mockBalance = 1250;
  const mockTransactions = [
    {
      id: 1,
      type: 'Credit',
      description: 'Received donation',
      amount: 500,
      date: 'Jan 25, 2025',
      color: 'green'
    },
    {
      id: 2,
      type: 'Debit',
      description: 'Made pledge',
      amount: 300,
      date: 'Jan 20, 2025',
      color: 'red'
    },
    {
      id: 3,
      type: 'Credit',
      description: 'Initial balance',
      amount: 1050,
      date: 'Jan 15, 2025',
      color: 'green'
    },
  ];
  
  const formatAmount = (amount: number) => {
    return amount > 0 ? `+${amount}` : `${amount}`;
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
          {mockBalance.toLocaleString()}{' '}
          <span style={{ fontSize: '24px' }}>GLM</span>
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          ⚠️ Simulated currency for demo purposes only
        </p>
      </div>
      
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
          Transactions
        </h2>
        
        {mockTransactions.length > 0 ? (
          <div>
            {mockTransactions.map(tx => (
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
                      background: tx.color === 'green' ? '#d1fae5' : '#fee2e2',
                      color: tx.color === 'green' ? '#065f46' : '#991b1b',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {tx.type}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {tx.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                    {tx.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: tx.color === 'green' ? '#059669' : '#dc2626'
                  }}>
                    {formatAmount(tx.color === 'green' ? tx.amount : -tx.amount)} GLM
                  </p>
                </div>
              </div>
            ))}
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

