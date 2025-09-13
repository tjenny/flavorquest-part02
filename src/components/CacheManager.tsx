import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { 
  getCacheStats, 
  clearAllFlavorQuestCache, 
  clearCachePattern,
  CACHE_KEYS 
} from '@/lib/cache';
import { useToast } from '@/components/ui/use-toast';

interface CacheStats {
  totalEntries: number;
  flavorQuestEntries: number;
  versionMismatches: number;
  expiredEntries: number;
}

const CacheManager: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStats = () => {
    setIsLoading(true);
    try {
      const newStats = getCacheStats();
      setStats(newStats);
    } catch (error) {
      console.error('Error getting cache stats:', error);
      toast({
        title: "Error",
        description: "Failed to get cache statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllCache = () => {
    try {
      clearAllFlavorQuestCache();
      refreshStats();
      toast({
        title: "Cache Cleared",
        description: "All FlavorQuest cache has been cleared",
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    }
  };

  const clearAICache = () => {
    try {
      clearCachePattern(CACHE_KEYS.AI_CHALLENGES);
      refreshStats();
      toast({
        title: "AI Cache Cleared",
        description: "AI-generated challenges cache has been cleared",
      });
    } catch (error) {
      console.error('Error clearing AI cache:', error);
      toast({
        title: "Error",
        description: "Failed to clear AI cache",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cache Manager</CardTitle>
          <CardDescription>Manage application cache</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Loading cache statistics...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Cache Statistics
          </CardTitle>
          <CardDescription>
            Current cache status and health metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Total Entries</div>
              <Badge variant="outline">{stats.totalEntries}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">FlavorQuest Entries</div>
              <Badge variant="outline">{stats.flavorQuestEntries}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Version Mismatches</div>
              <Badge variant={stats.versionMismatches > 0 ? "destructive" : "outline"}>
                {stats.versionMismatches}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Expired Entries</div>
              <Badge variant={stats.expiredEntries > 0 ? "destructive" : "outline"}>
                {stats.expiredEntries}
              </Badge>
            </div>
          </div>

          {(stats.versionMismatches > 0 || stats.expiredEntries > 0) && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {stats.versionMismatches > 0 && (
                  <div>Found {stats.versionMismatches} entries with outdated versions.</div>
                )}
                {stats.expiredEntries > 0 && (
                  <div>Found {stats.expiredEntries} expired entries.</div>
                )}
                Consider clearing the cache to improve performance.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={refreshStats} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Cache Management
          </CardTitle>
          <CardDescription>
            Clear cache entries to force regeneration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Clear AI Challenges Cache</h4>
            <p className="text-sm text-muted-foreground">
              This will force regeneration of all AI-generated challenges when users next open stone modals.
            </p>
            <Button onClick={clearAICache} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear AI Cache
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Clear All FlavorQuest Cache</h4>
            <p className="text-sm text-muted-foreground">
              This will clear all cached data including AI challenges, user preferences, and app state.
            </p>
            <Button onClick={clearAllCache} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Cache
            </Button>
          </div>

          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Cache clearing is immediate and will take effect on the next page refresh or when users interact with cached features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManager;
