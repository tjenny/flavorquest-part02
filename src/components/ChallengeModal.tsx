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
import type { Challenge } from '@/data/demoData';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ challenge, onClose }) => {
  const { completeChallenge } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
    
    const result = await completeChallenge(challenge.id, selectedFile || undefined, caption, rating);
    
    if (result.success) {
      toast({
        title: "Challenge completed! 🎉",
        description: `You earned ${challenge.points} points! Check out the community feed to see your post.`,
      });
      
      // Close modal and navigate to feed
      onClose();
      navigate('/app/feed');
    } else {
      toast({
        title: "Error completing challenge",
        description: result.error || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{getChallengeTypeEmoji(challenge.stoneId)}</span>
            {challenge.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {challenge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Photo Upload Section */}
          <div className="space-y-3">
            <Label htmlFor="photo" className="text-base font-semibold">
              Upload Your Photo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {selectedPhoto ? (
                <div className="space-y-3">
                  <img 
                    src={selectedPhoto} 
                    alt="Uploaded photo" 
                    className="mx-auto max-h-48 rounded-lg shadow-md"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPhoto('')}
                  >
                    Change Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <Label htmlFor="photo" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photo
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload a photo of your completed challenge
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Caption Section */}
          <div className="space-y-3">
            <Label htmlFor="caption" className="text-base font-semibold">
              Share Your Experience
            </Label>
            <Textarea
              id="caption"
              placeholder="Tell us about your experience! What did you think of the dish? Any tips for others?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Rate Your Experience
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded-full transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 hover:text-yellow-500' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-current' : ''
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Location Hint (if available) */}
          {challenge.locationHintAvailable && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                <MapPin className="w-4 h-4" />
                Location Hint Available
              </div>
              <p className="text-sm text-blue-700">
                Need help finding a good spot? We can suggest some great places to try this dish!
              </p>
            </div>
          )}

          {/* Points Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-800">Points to Earn:</span>
              <span className="text-lg font-bold text-green-600">{challenge.points} pts</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedPhoto || !caption.trim() || rating === 0}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Completing...
              </div>
            ) : (
              'Complete Challenge'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;