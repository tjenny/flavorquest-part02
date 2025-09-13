import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { listPathsForCountry, listMyPostsByCountry, myPathProgress } from '@/selectors/journeys';
import { COUNTRY_MAP, PATH_MAP } from '@/data/templates';
import { useApp } from '@/contexts/AppContext';
import { ProgressRing } from '@/components/journeys/ProgressRing';

export default function JourneysCountry() {
  const { countryId = '' } = useParams();
  const { currentUser, feedPosts } = useApp();
  const country = COUNTRY_MAP[countryId];
  const paths = listPathsForCountry(countryId);

  if (!currentUser) return <div className="p-4">Please sign in.</div>;
  if (!country) return <div className="p-4">Unknown country.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">{country.name}</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {paths.map(path => {
          const prog = myPathProgress(feedPosts, currentUser.id, path.id);
          const postsInPath = listMyPostsByCountry(feedPosts, currentUser.id, countryId).filter(p => p.pathId === path.id);
          const myCount = postsInPath.length;
          return (
            <Link key={path.id} to={`/app/journeys/${countryId}/${path.id}`} className="rounded-xl border p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{path.name}</div>
                  <div className="text-xs opacity-70 mt-1">{myCount} post{myCount===1?'':'s'}</div>
                </div>
                <ProgressRing points={prog.points} totalPoints={prog.totalPoints} />
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700">Path</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
