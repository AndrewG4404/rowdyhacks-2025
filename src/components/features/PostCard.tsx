import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

const categoryColors = {
  'Medical': 'bg-red-100 text-red-800',
  'Funeral': 'bg-purple-100 text-purple-800',
  'For fun': 'bg-yellow-100 text-yellow-800',
  'Vet bills': 'bg-green-100 text-green-800',
  'Education': 'bg-blue-100 text-blue-800',
  'Community Projects': 'bg-indigo-100 text-indigo-800',
  'Other': 'bg-gray-100 text-gray-800',
};

export function PostCard({ post }: PostCardProps) {
  const totalRaised = post.totalRaised || 0;
  const goal = post.goal || 0;
  
  return (
    <Link href={`/posts/${post.id}`}>
      <Card hover className="h-full flex flex-col">
        {post.images && post.images[0] && (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg -mt-6 -mx-6 mb-4 overflow-hidden">
            <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="mb-2">
          <Badge className={categoryColors[post.category]}>
            {post.category}
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {post.description}
        </p>
        
        {goal > 0 && (
          <div className="mt-auto">
            <ProgressBar current={totalRaised} goal={goal} />
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <Badge variant={post.status === 'open' ? 'success' : 'default'}>
            {post.status}
          </Badge>
          {post.acceptContracts && (
            <span className="text-xs text-gray-500">📝 Accepts contracts</span>
          )}
        </div>
      </Card>
    </Link>
  );
}

