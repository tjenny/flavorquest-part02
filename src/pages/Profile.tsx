import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Star, 
  Calendar,
  MapPin,
  Settings,
  Award
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import userSarah from '@/assets/user-sarah.jpg';
import userMike from '@/assets/user-mike.jpg';
import userAdmin from '@/assets/user-admin.jpg';

const Profile = () => {
  const { currentUser, challenges, feedPosts } = useApp();

  if (!currentUser) return null;

  const getUserImage = (userId: string) => {
    switch (userId) {
      case '1': return userSarah;
      case '2': return userMike;
      case 'admin': return userAdmin;
      default: return userSarah;
    }
  };

  const getLevelInfo = (points: number) => {
    if (points < 100) return { level: 'Food Newbie', progress: points, nextLevel: 100 };
    if (points < 300) return { level: 'Flavor Explorer', progress: points - 100, nextLevel: 200 };
    if (points < 500) return { level: 'Culinary Adventurer', progress: points - 300, nextLevel: 200 };
    return { level: 'FlavorQuest Master', progress: 0, nextLevel: 0 };
  };

  const levelInfo = getLevelInfo(currentUser.progress.points);
  const progressPercentage = levelInfo.nextLevel > 0 
    ? (levelInfo.progress / levelInfo.nextLevel) * 100 
    : 100;

  const completedChallenges = challenges.filter(c => 
    currentUser.progress.completedChallengeIds.includes(c.id)
  );

  const userPosts = feedPosts.filter(post => post.userId === currentUser.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  const challengesByType = {
    stone1: completedChallenges.filter(c => c.stoneId === 'stone1').length,
    stone2: completedChallenges.filter(c => c.stoneId === 'stone2').length,
    stone3: completedChallenges.filter(c => c.stoneId === 'stone3').length,
    stone4: completedChallenges.filter(c => c.stoneId === 'stone4').length,
  };

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      {/* Profile Header */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={getUserImage(currentUser.id)} alt={currentUser.displayName} />
              <AvatarFallback className="text-2xl">{currentUser.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold">{currentUser.displayName}</h1>
                {currentUser.isAdmin && (
                  <Badge variant="secondary" className="w-fit">
                    <Award className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">{currentUser.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className="bg-gradient-primary text-primary-foreground border-0">
                  {currentUser.progress.points} points
                </Badge>
                <Badge variant="secondary">
                  {levelInfo.level}
                </Badge>
                <Badge variant="outline">
                  {completedChallenges.length} challenges completed
                </Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{levelInfo.level}</span>
              <span>{levelInfo.progress}/{levelInfo.nextLevel} points</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
          
          {levelInfo.nextLevel > 0 && (
            <p className="text-sm text-muted-foreground">
              {levelInfo.nextLevel - levelInfo.progress} more points to reach the next level!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{completedChallenges.length}</p>
            <p className="text-xs text-muted-foreground">Challenges</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{totalLikes}</p>
            <p className="text-xs text-muted-foreground">Total Likes</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{userPosts.length}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Weeks Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Challenge Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                  🧋
                </div>
                <span className="text-sm">Drink Challenges</span>
              </div>
              <Badge variant="outline">{challengesByType.stone1}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm">
                  🧁
                </div>
                <span className="text-sm">Sweet Singapore</span>
              </div>
              <Badge variant="outline">{challengesByType.stone2}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">
                  🌶️
                </div>
                <span className="text-sm">Spice Adventure</span>
              </div>
              <Badge variant="outline">{challengesByType.stone3}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
                  ✨
                </div>
                <span className="text-sm">Modern Fusion</span>
              </div>
              <Badge variant="outline">{challengesByType.stone4}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser.dietary && currentUser.dietary.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentUser.dietary.map((restriction) => (
                <Badge key={restriction} variant="secondary">
                  {restriction}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No dietary restrictions set</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;