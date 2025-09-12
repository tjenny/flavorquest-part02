import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload, MapPin, Star } from 'lucide-react';
import { Challenge } from '@/data/demoData';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ challenge, onClose }) => {
  const { completeChallenge } = useApp();
  const { toast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedPhoto(result);
        toast({
          title: "Photo uploaded!",
          description: "Your photo has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPhoto || !caption.trim() || rating === 0) {
      toast({
        title: "Missing information",
        description: "Please upload a photo, add a caption, and rate your experience.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    completeChallenge(challenge.id, selectedPhoto, caption, rating);
    
    toast({
      title: "Challenge completed! 🎉",
      description: `You earned ${challenge.points} points!`,
    });
    
    onClose();
    setIsSubmitting(false);
  };

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChallengeTypeEmoji(challenge.stoneId)}
            {challenge.title}
          </DialogTitle>
          <DialogDescription>
            {challenge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Challenge Points */}
          <div className="bg-primary/10 p-3 rounded-lg text-center">
            <div className="text-primary font-semibold">
              {challenge.points} points available
            </div>
          </div>

          {/* Location Hint */}
          {challenge.locationHintAvailable && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Get location hints (available Thu-Sun, reduces points by 10%)
                </span>
              </div>
            </div>
          )}

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              {selectedPhoto ? (
                <div className="space-y-2">
                  <img 
                    src={selectedPhoto} 
                    alt="Challenge photo" 
                    className="w-full h-32 object-cover rounded mx-auto"
                  />
                  <p className="text-sm text-green-600">Photo uploaded successfully!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload a photo of your challenge
                  </p>
                </div>
              )}
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('photo')?.click()}
                className="mt-2"
              >
                <Camera className="h-4 w-4 mr-2" />
                {selectedPhoto ? 'Change Photo' : 'Take Photo'}
              </Button>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rate your experience</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Tell us about your experience..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedPhoto || !caption.trim() || rating === 0}
            variant="hero"
          >
            {isSubmitting ? 'Submitting...' : `Submit Challenge (+${challenge.points} pts)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;