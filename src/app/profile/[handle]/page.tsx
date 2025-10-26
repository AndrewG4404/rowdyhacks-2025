'use client';

export default function ProfilePage({ params }: { params: { handle: string } }) {
  // Mock data
  const mockUser = {
    handle: params.handle || 'johndoe',
    name: 'John Doe',
    bio: 'Community organizer passionate about helping others in need. Love to give back to my community.',
    avatarUrl: null
  };

  const mockPosts = [
    {
      id: 1,
      title: 'Help with Medical Bills',
      category: 'Medical',
      raised: 3200,
      goal: 5000
    },
    {
      id: 2,
      title: 'Community Park Project',
      category: 'Community Projects',
      raised: 1500,
      goal: 3000
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '40px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#6b7280'
          }}>
            {mockUser.handle[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              {mockUser.name}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '15px' }}>@{mockUser.handle}</p>
            <p style={{ color: '#374151', lineHeight: '1.6' }}>{mockUser.bio}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Posts by {mockUser.name}
        </h2>
      </div>

      {mockPosts.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {mockPosts.map(post => (
            <div
              key={post.id}
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '25px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '2px solid #e5e7eb'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                {post.title}
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  background: '#dbeafe', 
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {post.category}
                </span>
              </div>
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Progress</span>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'bold' }}>
                    ${post.raised}/${post.goal}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(post.raised / post.goal) * 100}%`, 
                    height: '100%', 
                    background: '#10b981'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '60px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>No posts yet</p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>This user hasn't created any posts</p>
        </div>
      )}
    </div>
  );
}

