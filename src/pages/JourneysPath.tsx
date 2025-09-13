import React from 'react';
import { useParams } from 'react-router-dom';
import { PATH_MAP } from '@/data/templates';
import { useApp } from '@/contexts/AppContext';
import { listMyPostsByPath } from '@/selectors/journeys';

export default function JourneysPath() {
  const { countryId = '', pathId = '' } = useParams();
  const { currentUser, feedPosts } = useApp();
  const path = PATH_MAP[pathId];

  if (!currentUser) return <div className="p-4">Please sign in.</div>;
  if (!path) return <div className="p-4">Unknown path.</div>;

  const posts = listMyPostsByPath(feedPosts, currentUser.id, pathId);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">{path.name}</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {posts.map(p => (
          <div key={p.id} className="rounded-xl border p-2 shadow-sm hover:shadow-md transition">
            {p.photo && p.photo !== '/placeholder.svg' && <img src={p.photo} alt={p.challengeTitle} className="w-full h-40 object-cover rounded-md" />}
            
            {/* Challenge Info & Rating - matching feed layout */}
            <div className="bg-muted/30 p-3 rounded-lg mt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary">
                  {p.challengeTitle}
                </p>
                {p.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xs ${
                          star <= p.rating 
                            ? 'text-yellow-400' 
                            : 'text-muted-foreground/30'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Place Name - matching feed layout */}
            {p.placeName && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-600">📍</span>
                  <span className="font-medium text-blue-800">Location:</span>
                  <span className="text-blue-700">{p.placeName}</span>
                </div>
              </div>
            )}
            
            {p.caption && <div className="text-sm mt-2">{p.caption}</div>}
            <div className="text-[11px] opacity-60 mt-1">{new Date(p.timestamp).toLocaleString()}</div>
          </div>
        ))}
        {posts.length === 0 && <div className="text-sm opacity-70">No posts yet on this track.</div>}
      </div>
    </div>
  );
}
