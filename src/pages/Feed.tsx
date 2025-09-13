import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Clock, Star, MapPin, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { CHALLENGE_MAP } from '@/data/templates';
import { ImagePreview } from '@/components/ImagePreview';
import { Textarea } from '@/components/ui/textarea';
import userSarah from '@/assets/user-sarah.jpg';
import userMike from '@/assets/user-mike.jpg';
import type { Comment } from '@/types/social';
import userAdmin from '@/assets/user-admin.jpg';

const Feed = () => {
  const { feedPosts, likeFeedPost, addCommentToPost, loadComments, users } = useApp();
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');

  const getUserImage = (userId: string) => {
    switch (userId) {
      case '1': return userSarah;
      case '2': return userMike;
      case 'admin': return userAdmin;
      default: return userSarah;
    }
  };

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId) || {
      id: userId,
      displayName: 'Unknown User',
      photo: userSarah
    };
  };

  const getChallengeTypeEmoji = (challengeId: string, challengeTitle: string, challengeType?: string) => {
    // First try to get challenge type from CHALLENGE_MAP
    const challenge = CHALLENGE_MAP[challengeId];
    const actualChallengeType = challenge?.type ?? challengeType;
    
    // Use the actual challenge type if available
    if (actualChallengeType) {
      switch (actualChallengeType.toLowerCase()) {
        case 'drink': return '🥤';
        case 'eat': return '🍽️';
        case 'cook': return '👨‍🍳';
        default: break;
      }
    }
    
    // Fallback to keyword matching for legacy challenges
    if (challengeTitle.toLowerCase().includes('bubble')) return '🧋';
    if (challengeTitle.toLowerCase().includes('chicken')) return '🍛';
    if (challengeTitle.toLowerCase().includes('crab')) return '🦀';
    if (challengeTitle.toLowerCase().includes('durian')) return '🍦';
    if (challengeTitle.toLowerCase().includes('kaya')) return '🍞';
    return '🍽️';
  };

  const handleOpenComments = async (postId: string) => {
    setOpenComments(postId);
    if (!comments[postId]) {
      const postComments = await loadComments(postId);
      setComments(prev => ({ ...prev, [postId]: postComments }));
    }
  };

  const handleSubmitComment = async (postId: string) => {
    if (!newComment.trim()) return;
    
    try {
      const comment = await addCommentToPost(postId, newComment.trim());
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Feed</h1>
          <p className="text-muted-foreground">See what fellow food explorers are discovering</p>
        </div>
        <Badge variant="outline" className="bg-gradient-primary text-primary-foreground border-0">
          {feedPosts.length} posts this week
        </Badge>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {feedPosts.map((post) => (
          <Card key={post.id} className="shadow-card hover:shadow-challenge transition-all duration-300">
            {/* Post Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getUserImage(post.userId)} alt={post.userName} />
                    <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post.userName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
        <Badge variant="secondary" className="text-xs">
          {getChallengeTypeEmoji(post.challengeId, post.challengeTitle, post.challengeType)} Challenge Complete
        </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Challenge Info & Rating */}
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">
                    {(() => {
                      const challenge = CHALLENGE_MAP[post.challengeId];
                      return challenge?.title ?? post.challengeTitle ?? 'Unknown Dish';
                    })()}
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= post.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Place Name - Moved here, right after dish name/rating */}
              {post.placeName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Location:</span>
                    <span className="text-blue-700">{post.placeName}</span>
                  </div>
                </div>
              )}

              {/* Photo */}
              <ImagePreview 
                src={post.photo} 
                alt="Challenge completion" 
                className="w-full h-64 object-cover rounded-lg"
                fallbackText="Demo image placeholder"
              />

              {/* Caption */}
              {post.caption && (
                <p className="text-sm">{post.caption}</p>
              )}

              {/* Quest Companions */}
              {post.questCompanions.length > 0 && (
                <div className="bg-accent/10 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="font-medium text-accent">Quest Companions:</span>
                    <span className="text-muted-foreground">
                      {post.questCompanions.join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeFeedPost(post.id)}
                  className={`flex items-center gap-2 ${
                    post.likedByCurrentUser ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                >
                  <Heart 
                    className={`h-4 w-4 ${post.likedByCurrentUser ? 'fill-current' : ''}`} 
                  />
                  <span>{post.likes}</span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-muted-foreground"
                  onClick={() => handleOpenComments(post.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentCount ?? 0}</span>
                </Button>

                <div className="text-xs text-muted-foreground">
                  +100 points earned
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {feedPosts.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Complete your first challenge to see posts in the community feed!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comments Modal */}
      {openComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Comments</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenComments(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments[openComments]?.map((comment) => {
                const user = getUserInfo(comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserImage(comment.userId)} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{user.displayName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">{comment.body}</div>
                    </div>
                  </div>
                );
              })}
              {(!comments[openComments] || comments[openComments].length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-[60px]"
                />
                <Button
                  onClick={() => handleSubmitComment(openComments)}
                  disabled={!newComment.trim()}
                  className="self-end"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;