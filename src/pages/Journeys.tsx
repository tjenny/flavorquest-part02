import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { COUNTRIES, COUNTRY_MAP } from '@/data/templates';
import { groupPostsByCountry } from '@/selectors/journeys';
import { Link } from 'react-router-dom';

export default function Journeys() {
  const { feedPosts } = useApp();
  const byCountry = groupPostsByCountry(feedPosts);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">My Journeys</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {COUNTRIES.map(c => {
          const count = byCountry[c.id]?.length ?? 0;
          return (
            <Link key={c.id} to={`/journeys/${c.id}`} className="rounded-lg border p-4 hover:bg-neutral-50">
              <div className="text-lg">{c.name}</div>
              <div className="text-sm opacity-70">{count} post{count===1?'':'s'}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
