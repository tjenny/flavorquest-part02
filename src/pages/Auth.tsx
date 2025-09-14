import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { ports } from '@/supabase/ports';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-singapore-food.jpg';
import userSarah from '@/assets/user-sarah.jpg';
import userMike from '@/assets/user-mike.jpg';
import userAdmin from '@/assets/user-admin.jpg';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { demoUsers, enterDemo } = useAuth();

  const handleAuth = async (isSignUp: boolean) => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await ports.auth.signUp(email, password);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        await ports.auth.signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUser = (userId: string) => {
    enterDemo(userId);
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
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-secondary/60" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-4">
            FlavorQuest
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-2">
            Explore the world bite by bite
          </p>
          <p className="text-lg text-primary-foreground/80">
            Sign in to start your culinary journey
          </p>
        </div>

        <Card className="w-full max-w-md shadow-glow animate-scale-in">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In / Sign Up</TabsTrigger>
              <TabsTrigger value="demo">Demo Mode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleAuth(false)}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  <Button 
                    onClick={() => handleAuth(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="demo">
              <CardHeader>
                <CardTitle>Try Demo Mode</CardTitle>
                <CardDescription>
                  Explore FlavorQuest with a demo account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleDemoUser(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={getUserImage(user.id)} alt={user.displayName} />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.displayName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.progress.points} points • {user.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {user.isAdmin && (
                        <Badge variant="secondary">Admin</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {user.progress.completedChallengeIds.length} challenges
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;