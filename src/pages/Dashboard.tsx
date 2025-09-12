import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Star, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getLevelInfo } from '@/data/demoData';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, challenges, feedPosts } = useApp();

  if (!currentUser) return null;

  const levelInfo = getLevelInfo(currentUser.totalPoints);
  const completedChallenges = challenges.filter(c => 
    currentUser.completedChallenges.includes(c.id)
  );
  const availableChallenges = challenges.filter(c => 
    !currentUser.completedChallenges.includes(c.id)
  );
  
  const userPosts = feedPosts.filter(post => post.userId === currentUser.id);
  const progressPercentage = levelInfo.nextLevel > 0 
    ? (levelInfo.progress / levelInfo.nextLevel) * 100 
    : 100;

  const challengeTypes = {
    stone1: completedChallenges.some(c => c.stoneId === 'stone1'),
    stone2: completedChallenges.some(c => c.stoneId === 'stone2'),
    stone3: completedChallenges.some(c => c.stoneId === 'stone3'),
    stone4: completedChallenges.some(c => c.stoneId === 'stone4'),
  };

  const canLevelUp = challengeTypes.stone1 && challengeTypes.stone2 && challengeTypes.stone3;

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
          <p className="text-muted-foreground">Ready for your next culinary adventure?</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-gradient-primary text-primary-foreground border-0">
            Level {levelInfo.level}
          </Badge>
          <Badge variant="secondary">
            {currentUser.totalPoints} points
          </Badge>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Level Progress</span>
              <span>{levelInfo.progress}/{levelInfo.nextLevel} points</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                challengeTypes.stone1 ? 'bg-accent' : 'bg-muted'
              }`}>
                🍜
              </div>
              <p className="text-xs mt-1 text-muted-foreground">Hawker</p>
              <p className="text-xs font-semibold">{challengeTypes.stone1 ? '✓' : '○'}</p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                challengeTypes.stone2 ? 'bg-accent' : 'bg-muted'
              }`}>
                🧁
              </div>
              <p className="text-xs mt-1 text-muted-foreground">Sweets</p>
              <p className="text-xs font-semibold">{challengeTypes.stone2 ? '✓' : '○'}</p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                challengeTypes.stone3 ? 'bg-accent' : 'bg-muted'
              }`}>
                🌶️
              </div>
              <p className="text-xs mt-1 text-muted-foreground">Spicy</p>
              <p className="text-xs font-semibold">{challengeTypes.stone3 ? '✓' : '○'}</p>
            </div>
          </div>

          {canLevelUp && (
            <div className="bg-gradient-tropical p-4 rounded-lg text-center animate-bounce-gentle">
              <p className="text-sm font-semibold text-white">
                🎉 Ready to level up! Complete one more challenge in any category!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{completedChallenges.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{availableChallenges.length}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <Target className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{userPosts.length}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <Star className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {userPosts.reduce((sum, post) => sum + post.likes, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Likes</p>
              </div>
              <div className="text-2xl">❤️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">This Week's Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {availableChallenges.length} challenges waiting for you
            </p>
            <Link to="/challenges">
              <Button className="w-full" variant="hero">
                View Challenges
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Community Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See what other food explorers are up to
            </p>
            <Link to="/feed">
              <Button variant="outline" className="w-full">
                Explore Feed
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;