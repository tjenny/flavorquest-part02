import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Clock, Star, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { CHALLENGE_MAP } from '@/data/templates';
import { ImagePreview } from '@/components/ImagePreview';
import userSarah from '@/assets/user-sarah.jpg';
import userMike from '@/assets/user-mike.jpg';
import userAdmin from '@/assets/user-admin.jpg';

const Feed = () => {
  const { feedPosts, likeFeedPost } = useApp();

  const getUserImage = (userId: string) => {
    switch (userId) {
      case '1': return userSarah;
      case '2': return userMike;
      case 'admin': return userAdmin;
      default: return userSarah;
    }
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

              {/* Place Name - Enhanced Display */}
              {post.placeName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Location:</span>
                    <span className="text-blue-700">{post.placeName}</span>
                  </div>
                </div>
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

                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>Comment</span>
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
    </div>
  );
};

export default Feed;