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
    if (points < 100) return { 
      level: 'Food Newbie', 
      progress: points, 
      nextLevel: 100, 
      levelNumber: 1,
      totalLevels: 4,
      levelProgress: (points / 100) * 100,
      pointsNeeded: 100 - points
    };
    if (points < 300) return { 
      level: 'Flavor Explorer', 
      progress: points - 100, 
      nextLevel: 200, 
      levelNumber: 2,
      totalLevels: 4,
      levelProgress: ((points - 100) / 200) * 100,
      pointsNeeded: 300 - points
    };
    if (points < 500) return { 
      level: 'Culinary Adventurer', 
      progress: points - 300, 
      nextLevel: 200, 
      levelNumber: 3,
      totalLevels: 4,
      levelProgress: ((points - 300) / 200) * 100,
      pointsNeeded: 500 - points
    };
    return { 
      level: 'FlavorQuest Master', 
      progress: 0, 
      nextLevel: 0, 
      levelNumber: 4,
      totalLevels: 4,
      levelProgress: 100,
      pointsNeeded: 0
    };
  };

  const levelInfo = getLevelInfo(currentUser.progress.points);
  const progressPercentage = levelInfo.levelProgress;

  const completedChallenges = challenges.filter(c => 
    currentUser.progress.completedChallengeIds.includes(c.id)
  );

  const userPosts = feedPosts.filter(post => post.userId === currentUser.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  const challengesByType = {
    eat: completedChallenges.filter(c => c.type === 'eat').length,
    drink: completedChallenges.filter(c => c.type === 'drink').length,
    cook: completedChallenges.filter(c => c.type === 'cook').length,
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
        <CardContent className="space-y-6">
          {/* Level Badge and Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {levelInfo.levelNumber}
              </div>
              <div>
                <h3 className="font-bold text-xl">{levelInfo.level}</h3>
                <p className="text-sm text-muted-foreground">
                  Level {levelInfo.levelNumber} of {levelInfo.totalLevels}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{currentUser.progress.points}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            {levelInfo.pointsNeeded > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                {levelInfo.pointsNeeded} more points to reach the next level!
              </p>
            )}
          </div>
          
          {/* Level Overview */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((levelNum) => {
              const isCompleted = levelNum < levelInfo.levelNumber;
              const isCurrent = levelNum === levelInfo.levelNumber;
              const levelNames = ['Food Newbie', 'Flavor Explorer', 'Culinary Adventurer', 'FlavorQuest Master'];
              const levelEmojis = ['🍽️', '🌍', '🏆', '👑'];
              const levelColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'];
              
              return (
                <div
                  key={levelNum}
                  className={`text-center p-3 rounded-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-md'
                      : isCurrent
                      ? 'bg-primary/10 text-primary shadow-md border-2 border-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {isCompleted ? '✓' : levelNum}
                  </div>
                  <p className="text-xs font-medium leading-tight">{levelNames[levelNum - 1]}</p>
                  <div className="text-lg mt-1">
                    {isCompleted ? '✅' : isCurrent ? levelEmojis[levelNum - 1] : '⭕'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievement Badge */}
          {levelInfo.levelNumber === 4 && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">👑</div>
              <h4 className="font-bold text-lg">FlavorQuest Master!</h4>
              <p className="text-sm">You've reached the highest level! Congratulations!</p>
            </div>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg">
                  🍽️
                </div>
                <div>
                  <span className="text-sm font-medium">Eat Challenges</span>
                  <p className="text-xs text-muted-foreground">Food adventures completed</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {challengesByType.eat}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                  🧋
                </div>
                <div>
                  <span className="text-sm font-medium">Drink Challenges</span>
                  <p className="text-xs text-muted-foreground">Beverage experiences completed</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {challengesByType.drink}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">
                  👨‍🍳
                </div>
                <div>
                  <span className="text-sm font-medium">Cook Challenges</span>
                  <p className="text-xs text-muted-foreground">Cooking experiences completed</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {challengesByType.cook}
              </Badge>
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