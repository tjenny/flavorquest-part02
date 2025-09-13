import { PATHS, COUNTRY_MAP, PATH_MAP, allChallengeIdsForPath, allChallengeIdsForCountry } from '@/data/templates';
import type { Post } from '@/types/domain';

export function myPosts(posts: Post[], userId: string) {
  return posts.filter(p => p.userId === userId);
}

export function groupMyPostsByCountry(posts: Post[], userId: string) {
  const mine = myPosts(posts, userId);
  const map: Record<string, Post[]> = {};
  mine.forEach(p => {
    const c = p.countryId ?? 'unknown';
    (map[c] ||= []).push(p);
  });
  return map;
}

export function listMyPostsByCountry(posts: Post[], userId: string, countryId: string) {
  return myPosts(posts, userId).filter(p => p.countryId === countryId);
}

export function listMyPostsByPath(posts: Post[], userId: string, pathId: string) {
  return myPosts(posts, userId).filter(p => p.pathId === pathId);
}

/** Progress helpers (approximation by completions/posts) */
export function myCompletedChallengeIdsFromPosts(posts: Post[], userId: string): Set<string> {
  return new Set(myPosts(posts, userId).map(p => p.challengeId));
}

export function myPathProgress(posts: Post[], userId: string, pathId: string) {
  const totalIds = allChallengeIdsForPath(pathId);
  const completed = myCompletedChallengeIdsFromPosts(posts, userId);
  const done = totalIds.filter(id => completed.has(id));
  const points = done.length * 100; // Each challenge gives 100 points
  const totalPoints = totalIds.length * 100;
  return { total: totalIds.length, done: done.length, points, totalPoints };
}

export function myCountryProgress(posts: Post[], userId: string, countryId: string) {
  const totalIds = allChallengeIdsForCountry(countryId);
  const completed = myCompletedChallengeIdsFromPosts(posts, userId);
  const done = totalIds.filter(id => completed.has(id));
  const points = done.length * 100; // Each challenge gives 100 points
  const totalPoints = totalIds.length * 100;
  return { total: totalIds.length, done: done.length, points, totalPoints };
}

export function listPathsForCountry(countryId: string) {
  return PATHS.filter(p => p.countryId === countryId).sort((a,b)=>a.order - b.order);
}
