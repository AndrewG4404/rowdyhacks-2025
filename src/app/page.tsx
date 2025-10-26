export default function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e40af', marginBottom: '20px' }}>
          🎉 GoLoanMe
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '30px' }}>
          Community Micro-Funding Platform
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a href="/explore" style={{ 
            padding: '12px 30px', 
            background: '#1e40af', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            Explore Campaigns
          </a>
          <a href="/test" style={{ 
            padding: '12px 30px', 
            background: '#ef4444', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            Test Page
          </a>
        </div>
      </div>

      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        marginBottom: '40px'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>✨ Status Check</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px', fontSize: '18px' }}>✅ Server is running on port 3000</li>
          <li style={{ padding: '10px', fontSize: '18px' }}>✅ React is rendering correctly</li>
          <li style={{ padding: '10px', fontSize: '18px' }}>✅ Next.js App Router is working</li>
          <li style={{ padding: '10px', fontSize: '18px' }}>✅ Layout is displaying</li>
        </ul>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>📝 Create Post</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Share your funding request with the community
          </p>
          <a href="/posts/new" style={{ color: '#1e40af', textDecoration: 'underline' }}>Get Started →</a>
        </div>

        <div style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>💰 Explore</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Browse active funding campaigns
          </p>
          <a href="/explore" style={{ color: '#1e40af', textDecoration: 'underline' }}>Browse →</a>
        </div>

        <div style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>💳 Wallet</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Check your GLM balance and transactions
          </p>
          <a href="/wallet" style={{ color: '#1e40af', textDecoration: 'underline' }}>View →</a>
        </div>
      </div>
    </div>
  );
}


