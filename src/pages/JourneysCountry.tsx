import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { listPathsForCountry } from '@/selectors/journeys';
import { COUNTRY_MAP, PATH_MAP } from '@/data/templates';
import { useApp } from '@/contexts/AppContext';
import { listPostsByCountry } from '@/selectors/journeys';

export default function JourneysCountry() {
  const { countryId = '' } = useParams();
  const { feedPosts } = useApp();
  const country = COUNTRY_MAP[countryId];
  const paths = listPathsForCountry(countryId);
  const postsInCountry = listPostsByCountry(feedPosts, countryId);

  // quick counts per path
  const counts: Record<string, number> = {};
  postsInCountry.forEach(p => {
    if (p.pathId) counts[p.pathId] = (counts[p.pathId] ?? 0) + 1;
  });

  if (!country) return <div className="p-4">Unknown country.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">{country.name}</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {paths.map(path => (
          <Link key={path.id} to={`/journeys/${countryId}/${path.id}`} className="rounded-lg border p-4 hover:bg-neutral-50">
            <div className="font-medium">{path.name}</div>
            <div className="text-sm opacity-70">{counts[path.id] ?? 0} post{(counts[path.id] ?? 0)===1?'':'s'}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
