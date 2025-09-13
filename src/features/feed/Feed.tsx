import type { Post } from '@/types/social';
import { ImagePreview } from '@/components/ImagePreview';

interface FeedProps {
  posts: Post[];
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
}

export function Feed({ posts, onLike, onComment }: FeedProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet. Complete some challenges to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div>
              <p className="font-medium">User {post.userId}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <ImagePreview 
              src={post.photo || post.photoUrl || ''} 
              alt="Challenge completion" 
              className="w-full h-64 object-cover rounded-lg"
              fallbackText="Demo image placeholder"
            />
          </div>
          
          {post.caption && (
            <p className="text-gray-800 mb-4">{post.caption}</p>
          )}
          
          <div className="flex space-x-4">
            <button 
              onClick={() => onLike?.(post.id)}
              className={`flex items-center space-x-2 transition-colors ${
                post.likedByCurrentUser 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span>{post.likedByCurrentUser ? '❤️' : '🤍'}</span>
              <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            <button 
              onClick={() => onComment?.(post.id, 'Great job!')}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            >
              <span>💬</span>
              <span>Comment</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
