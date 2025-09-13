import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { COUNTRIES, COUNTRY_MAP } from '@/data/templates';
import { groupMyPostsByCountry, myCountryProgress } from '@/selectors/journeys';
import { Link } from 'react-router-dom';
import { ProgressRing } from '@/components/journeys/ProgressRing';

export default function Journeys() {
  const { currentUser, feedPosts } = useApp();
  if (!currentUser) return <div className="p-4">Please sign in.</div>;

  const posts = feedPosts ?? [];
  const byCountry = groupMyPostsByCountry(posts, currentUser.id);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">My Journeys</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {COUNTRIES.map(c => {
          const prog = myCountryProgress(posts, currentUser.id, c.id);
          const count = byCountry[c.id]?.length ?? 0;
          return (
            <Link key={c.id} to={`/app/journeys/${c.id}`} className="rounded-xl border p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{c.name}</div>
                  <div className="text-xs mt-1 opacity-70">{count} post{count===1?'':'s'}</div>
                </div>
                <ProgressRing points={prog.points} totalPoints={prog.totalPoints} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
