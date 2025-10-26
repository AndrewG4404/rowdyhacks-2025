'use client';

import { useState } from 'react';

export default function ExplorePage() {
  const [isLoading] = useState(false);
  
  // Mock posts data
  const mockPosts = [
    {
      id: 1,
      title: 'Help with Medical Bills',
      description: 'Needing help to cover emergency surgery costs',
      category: 'Medical',
      status: 'open',
      goal: 5000,
      raised: 3200
    },
    {
      id: 2,
      title: 'Tuition Support',
      description: 'Community college tuition for upcoming semester',
      category: 'Education',
      status: 'open',
      goal: 3000,
      raised: 800
    },
    {
      id: 3,
      title: 'Local Park Cleanup',
      description: 'Funding for supplies to clean up neighborhood park',
      category: 'Community Projects',
      status: 'open',
      goal: 500,
      raised: 450
    }
  ];
  
  const categories = ['Medical', 'Funeral', 'For fun', 'Vet bills', 'Education', 'Community Projects', 'Other'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          📋 Explore Posts
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Browse funding requests from your community
        </p>
      </div>
      
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <select style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px'
          }}>
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px'
          }}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '20px' }}>
          Loading...
        </div>
      ) : (
        <div style={{ marginBottom: '20px', color: '#6b7280' }}>
          Showing {mockPosts.length} posts
        </div>
      )}
      
      {mockPosts.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {mockPosts.map(post => (
            <div 
              key={post.id}
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '2px solid #e5e7eb'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                {post.title}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '15px' }}>
                {post.description}
              </p>
              <div style={{ 
                display: 'inline-block', 
                padding: '4px 12px', 
                background: '#dbeafe', 
                color: '#1e40af',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '15px'
              }}>
                {post.category}
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
                    background: '#10b981',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '8px' }}>No posts found</p>
          <p style={{ color: '#9ca3af' }}>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

