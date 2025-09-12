import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle2, MapPin, Sparkles, Utensils, Coffee, ChefHat } from 'lucide-react';
import { Challenge } from '@/data/demoData';
import { cn } from '@/lib/utils';

interface ChallengeItemProps {
  challenge: Challenge;
  isCompleted: boolean;
  onSelect: () => void;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({
  challenge,
  isCompleted,
  onSelect,
}) => {
  const getTypeIcon = () => {
    switch (challenge.type) {
      case 'eat': return <Utensils className="w-3 h-3" />;
      case 'drink': return <Coffee className="w-3 h-3" />;
      case 'cook': return <ChefHat className="w-3 h-3" />;
      default: return <Utensils className="w-3 h-3" />;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 cursor-pointer",
      {
        "opacity-80 bg-muted/50": isCompleted,
        "hover:shadow-challenge hover:shadow-lg": !isCompleted,
      }
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Challenge Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h4 className="font-semibold text-sm md:text-base truncate">
                  {challenge.title}
                </h4>
                {challenge.isAIGenerated && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                {challenge.points} pts
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {challenge.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Challenge Type */}
                {challenge.type && (
                  <Badge variant="outline" className="text-xs">
                    {getTypeIcon()}
                    <span className="ml-1 capitalize">{challenge.type}</span>
                  </Badge>
                )}
                
                {/* Location Hint */}
                {challenge.locationHintAvailable && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Location hint</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!isCompleted ? (
                <Button
                  onClick={onSelect}
                  size="sm"
                  variant="hero"
                  className="ml-auto"
                >
                  <Camera className="w-3 h-3 mr-1" />
                  Start
                </Button>
              ) : (
                <div className="flex items-center text-sm text-green-600 ml-auto">
                  Completed
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeItem;