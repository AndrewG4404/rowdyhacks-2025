'use client';

import Link from 'next/link';
import { useMyTerms, useAuth } from '@/lib/hooks';

export default function TermsPage() {
  const { isAuthenticated } = useAuth();
  const { data: terms, isLoading, error } = useMyTerms();

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', color: '#6b7280' }}>Please login to view your terms</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
            📜 My Terms
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            Create and manage your contract terms templates
          </p>
        </div>
        <Link 
          href="/terms/new"
          style={{
            padding: '12px 30px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Create Terms
        </Link>
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
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {isLoading ? (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading your terms...</p>
        </div>
      ) : terms && terms.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {terms.map((term: any) => (
            <div
              key={term.id}
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '25px',
                border: '2px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                    {term.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {term.inputs?.interestPercent !== undefined && (
                      <span style={{ 
                        padding: '4px 12px', 
                        background: '#dbeafe', 
                        color: '#1e40af',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {term.inputs.interestPercent}% interest
                      </span>
                    )}
                    {term.inputs?.cadence && (
                      <span style={{ 
                        padding: '4px 12px', 
                        background: '#e0e7ff', 
                        color: '#4338ca',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {term.inputs.cadence} repayment
                      </span>
                    )}
                    {term.inputs?.graceDays !== undefined && (
                      <span style={{ 
                        padding: '4px 12px', 
                        background: '#fef3c7', 
                        color: '#92400e',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {term.inputs.graceDays} day grace
                      </span>
                    )}
                  </div>
                </div>
                {term.pdfUrl && (
                  <a
                    href={term.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      color: '#374151',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    📄 View PDF
                  </a>
                )}
              </div>

              {term.inputs?.collateralText && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>
                    Collateral:
                  </p>
                  <p style={{ fontSize: '14px', color: '#374151' }}>
                    {term.inputs.collateralText}
                  </p>
                </div>
              )}

              {term.inputs?.locality && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>
                    Location:
                  </p>
                  <p style={{ fontSize: '14px', color: '#374151' }}>
                    {term.inputs.locality}
                  </p>
                </div>
              )}

              <div style={{ 
                marginTop: '15px', 
                paddingTop: '15px', 
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Created: {new Date(term.createdAt).toLocaleDateString()}
                  {term.llmVersion && (
                    <span style={{ marginLeft: '12px' }}>
                      • Model: {term.llmVersion}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
            Create Your First Terms Template
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            Generate custom AI-powered contract templates for your pledges
          </p>
          <Link 
            href="/terms/new"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            + Create Terms Template
          </Link>
        </div>
      )}
    </div>
  );
}
