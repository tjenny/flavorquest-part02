import { PATHS, COUNTRY_MAP, PATH_MAP } from '@/data/templates';
import type { Post } from '@/types/social';

export function groupPostsByCountry(posts: Post[]) {
  const map: Record<string, Post[]> = {};
  posts.forEach(p => {
    const c = p.countryId ?? 'unknown';
    (map[c] ||= []).push(p);
  });
  return map;
}

export function listPathsForCountry(countryId: string) {
  return PATHS.filter(p => p.countryId === countryId).sort((a,b)=>a.order - b.order);
}

export function listPostsByCountry(posts: Post[], countryId: string) {
  return posts.filter(p => p.countryId === countryId);
}

export function listPostsByPath(posts: Post[], pathId: string) {
  return posts.filter(p => p.pathId === pathId);
}
