import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-singapore-food.jpg';
import userSarah from '@/assets/user-sarah.jpg';
import userMike from '@/assets/user-mike.jpg';
import userAdmin from '@/assets/user-admin.jpg';

const Login = () => {
  const { users, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleUserSelect = (user: any) => {
    setCurrentUser(user);
    navigate('/app/feed');
  };

  const getUserImage = (userId: string) => {
    switch (userId) {
      case '1': return userSarah;
      case '2': return userMike;
      case 'admin': return userAdmin;
      default: return userSarah;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-secondary/60" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-4">
            FlavorQuest
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-2">
            Explore the world bite by bite
          </p>
          <p className="text-lg text-primary-foreground/80">
            Discover Singapore's culinary treasures through exciting challenges
          </p>
        </div>

        <Card className="w-full max-w-md shadow-glow animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Demo User</CardTitle>
            <CardDescription>
              Select a demo profile to explore FlavorQuest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in"
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getUserImage(user.id)} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.totalPoints} points • {user.level}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {user.isAdmin && (
                    <Badge variant="secondary">Admin</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {user.completedChallenges.length} challenges
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in">
          <p className="text-primary-foreground/80 text-sm">
            This is a demo app showcasing FlavorQuest features
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;