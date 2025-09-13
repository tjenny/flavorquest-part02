const pad3 = (n: number) => String(n).padStart(3, '0');

export const stoneId = (n: number) => `stone${pad3(n)}`;

export const challengeId = (stoneOrder: number, chalOrder: number) => 
  `${stoneId(stoneOrder)}-challenge${pad3(chalOrder)}`;

export const canonicalizeChallengeId = (raw: string, stoneOrderHint?: number) => {
  const m = raw.match(/stone(\d+)-challenge(\d+)/);
  if (m) return `stone${m[1].padStart(3, '0')}-challenge${m[2].padStart(3, '0')}`;
  const c = raw.match(/challenge(\d+)/);
  if (c && stoneOrderHint) return challengeId(stoneOrderHint, Number(c[1]));
  return raw;
};

export const isStoneId = (id: string): boolean => {
  return /^stone\d{3}$/.test(id);
};

export const isChallengeId = (id: string): boolean => {
  return /^stone\d{3}-challenge\d{3}$/.test(id);
};