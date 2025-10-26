'use client';

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          📜 My Terms
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Create and manage your contract terms templates
        </p>
      </div>

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
          Generate custom contract templates for your pledges
        </p>
        <button style={{
          padding: '12px 30px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          + Create Terms Template
        </button>
      </div>
    </div>
  );
}

