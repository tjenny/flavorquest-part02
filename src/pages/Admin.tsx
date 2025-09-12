import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp,
  Plus,
  BarChart,
  Settings
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import userSarah from '@/assets/user-sarah.jpg';
import userMike from '@/assets/user-mike.jpg';
import userAdmin from '@/assets/user-admin.jpg';

const Admin = () => {
  const { currentUser, users, challenges, feedPosts } = useApp();

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
      </div>
    );
  }

  const getUserImage = (userId: string) => {
    switch (userId) {
      case '1': return userSarah;
      case '2': return userMike;
      case 'admin': return userAdmin;
      default: return userSarah;
    }
  };

  const totalUsers = users.filter(u => !u.isAdmin).length;
  const totalChallenges = challenges.length;
  const totalPosts = feedPosts.length;
  
  const challengeCompletionRates = challenges.map(challenge => {
    const completedCount = users.filter(user => 
      user.completedChallenges.includes(challenge.id)
    ).length;
    return {
      ...challenge,
      completionRate: (completedCount / totalUsers) * 100,
      completedBy: completedCount
    };
  });

  const getChallengeTypeEmoji = (stoneId: string) => {
    switch (stoneId) {
      case 'stone1': return '🍜';
      case 'stone2': return '🧁';
      case 'stone3': return '🌶️';
      case 'stone4': return '✨';
      default: return '🍽️';
    }
  };

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage FlavorQuest challenges and users</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-primary" variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            New Challenge
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalChallenges}</p>
                <p className="text-xs text-muted-foreground">Total Challenges</p>
              </div>
              <Trophy className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-xs text-muted-foreground">Posts Created</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(challengeCompletionRates.reduce((sum, c) => sum + c.completionRate, 0) / challengeCompletionRates.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg. Completion</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Completion Rates */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Challenge Completion Rates
          </CardTitle>
          <CardDescription>
            Track how users are engaging with each challenge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {challengeCompletionRates.map((challenge) => (
            <div key={challenge.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {getChallengeTypeEmoji(challenge.stoneId)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{challenge.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Stone {challenge.stoneId.replace('stone', '')} challenge
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {challenge.completedBy}/{totalUsers} users
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {challenge.completionRate.toFixed(1)}% completion
                  </p>
                </div>
              </div>
              <Progress value={challenge.completionRate} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* User Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>
            Recent user engagement and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.filter(u => !u.isAdmin).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getUserImage(user.id)} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.level}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user.totalPoints} pts</p>
                  <p className="text-xs text-muted-foreground">
                    {user.completedChallenges.length}/3 challenges
                  </p>
                </div>
                
                <div className="flex gap-1">
                  {user.dietaryRestrictions.map((restriction) => (
                    <Badge key={restriction} variant="outline" className="text-xs">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Create New Challenge</CardTitle>
            <CardDescription>
              Add a new challenge to this week's lineup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Export Data</CardTitle>
            <CardDescription>
              Download user activity and challenge reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <BarChart className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;