import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ports } from '@/supabase/ports';
import { useApp } from '@/contexts/AppContext';
import type { DietaryPref } from '@/ports/profile';

const dietaryOptions: DietaryPref[] = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'None'];

const Onboarding = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPref[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUserProfile } = useApp();

  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    try {
      const available = await ports.profile.isUsernameAvailable(value);
      setUsernameAvailable(available);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (!displayName) {
      setDisplayName(value);
    }
    
    // Debounce username check
    const timer = setTimeout(() => checkUsername(value), 500);
    return () => clearTimeout(timer);
  };

  const handleDietaryChange = (pref: DietaryPref, checked: boolean) => {
    if (pref === 'None') {
      setDietaryPrefs(checked ? ['None'] : []);
    } else {
      setDietaryPrefs(prev => {
        const filtered = prev.filter(p => p !== 'None');
        return checked 
          ? [...filtered, pref]
          : filtered.filter(p => p !== pref);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: "Username taken",
        description: "Please choose a different username",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await ports.profile.upsertMine({
        username,
        displayName: displayName || username,
        dietaryPrefs: dietaryPrefs.length > 0 ? dietaryPrefs : ['None']
      });
      
      await refreshUserProfile();
      
      toast({
        title: "Welcome to FlavorQuest!",
        description: "Your profile has been set up successfully",
      });
      
      navigate('/app/feed');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-glow">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to personalize your FlavorQuest experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username*</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Choose a username"
                disabled={isLoading}
              />
              {usernameAvailable === false && (
                <p className="text-sm text-destructive">Username is already taken</p>
              )}
              {usernameAvailable === true && (
                <p className="text-sm text-green-600">Username is available</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we display your name?"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map((pref) => (
                  <div key={pref} className="flex items-center space-x-2">
                    <Checkbox
                      id={pref}
                      checked={dietaryPrefs.includes(pref)}
                      onCheckedChange={(checked) => 
                        handleDietaryChange(pref, checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={pref} className="text-sm">{pref}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !username || usernameAvailable === false}
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;