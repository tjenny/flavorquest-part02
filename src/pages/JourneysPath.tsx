import React from 'react';
import { useParams } from 'react-router-dom';
import { PATH_MAP } from '@/data/templates';
import { useApp } from '@/contexts/AppContext';
import { listPostsByPath } from '@/selectors/journeys';

export default function JourneysPath() {
  const { countryId = '', pathId = '' } = useParams();
  const { feedPosts } = useApp();
  const path = PATH_MAP[pathId];
  const posts = listPostsByPath(feedPosts, pathId);

  if (!path) return <div className="p-4">Unknown path.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">{path.name}</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {posts.map(p => (
          <div key={p.id} className="rounded-lg border p-2">
            {p.photo && p.photo !== '/placeholder.svg' && <img src={p.photo} alt={p.challengeTitle} className="w-full h-40 object-cover rounded-md" />}
            <div className="mt-2 text-sm font-medium">{p.challengeTitle}</div>
            {p.placeName && <div className="text-xs opacity-70">• {p.placeName}</div>}
            {p.caption && <div className="text-sm mt-1">{p.caption}</div>}
            <div className="text-xs opacity-70 mt-1">{p.timestamp.toLocaleString()}</div>
          </div>
        ))}
        {posts.length === 0 && <div className="text-sm opacity-70">No posts yet on this track.</div>}
      </div>
    </div>
  );
}
