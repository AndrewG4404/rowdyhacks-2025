'use client';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = params.id;
  
  // Mock data
  const mockPost = {
    id: postId || '1',
    title: 'Help with Medical Bills',
    description: 'Needing help to cover emergency surgery costs. Any support would be greatly appreciated.',
    category: 'Medical',
    status: 'open',
    goal: 5000,
    raised: 3200,
    owner: 'John Doe'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          {mockPost.title}
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
            {mockPost.category}
          </span>
          <span style={{ color: '#6b7280' }}>by {mockPost.owner}</span>
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
        <p style={{ color: '#374151', lineHeight: '1.6' }}>
          {mockPost.description}
        </p>
      </div>

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
            <span style={{ color: '#6b7280' }}>Raised: ${mockPost.raised.toLocaleString()}</span>
            <span style={{ color: '#6b7280' }}>Goal: ${mockPost.goal.toLocaleString()}</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '12px', 
            background: '#e5e7eb', 
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(mockPost.raised / mockPost.goal) * 100}%`, 
              height: '100%', 
              background: '#10b981',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginTop: '15px' }}>
          {Math.round((mockPost.raised / mockPost.goal) * 100)}% funded
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Make a Pledge</h2>
        <form onSubmit={(e) => { e.preventDefault(); alert('Pledge submission will be implemented with backend integration'); }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Amount (GLM)
            </label>
            <input
              type="number"
              required
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
              rows={3}
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
            style={{
              width: '100%',
              padding: '14px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Make Donation
          </button>
        </form>
      </div>
    </div>
  );
}

