'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePosts } from '@/lib/hooks';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const { data, isLoading, error } = usePosts({ 
    q: searchQuery || undefined, 
    category: selectedCategory || undefined,
    status: selectedStatus || undefined 
  });
  
  const posts = data?.items || [];
  
  const categories = ['medical', 'funeral', 'fun', 'vet', 'education', 'community', 'other'];
  const categoryLabels: Record<string, string> = {
    medical: 'Medical',
    funeral: 'Funeral',
    fun: 'For Fun',
    vet: 'Vet Bills',
    education: 'Education',
    community: 'Community Projects',
    other: 'Other'
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{categoryLabels[cat]}</option>)}
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
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
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '20px' }}>
          Loading...
        </div>
      ) : (
        <div style={{ marginBottom: '20px', color: '#6b7280' }}>
          Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {!isLoading && posts.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
              <div 
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  border: '2px solid #e5e7eb',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                  {post.title}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '15px', minHeight: '40px' }}>
                  {post.description.length > 100 ? `${post.description.substring(0, 100)}...` : post.description}
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
                  {categoryLabels[post.category] || post.category}
                </div>
                {post.goalGLM && (
                  <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'bold' }}>
                        {post.stats?.fundedGLM || 0} / {post.goalGLM} GLM
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
                        width: `${Math.min(((post.stats?.fundedGLM || 0) / post.goalGLM) * 100, 100)}%`, 
                        height: '100%', 
                        background: '#10b981',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                )}
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                  {post.stats?.donors || 0} donors • {post.stats?.sponsors || 0} sponsors
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : !isLoading && (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '8px' }}>No posts found</p>
          <p style={{ color: '#9ca3af' }}>Try adjusting your filters or <Link href="/posts/new" style={{ color: '#2563eb' }}>create a new post</Link></p>
        </div>
      )}
    </div>
  );
}

