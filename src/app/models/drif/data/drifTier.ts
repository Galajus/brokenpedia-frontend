export interface DrifTier {
  tier: number,
  minItemRanks: number,
  maxDrifLevel: number
}

const drifTiers: DrifTier[] = [
  {
    tier: 1,
    minItemRanks: 0,
    maxDrifLevel: 6
  },
  {
    tier: 2,
    minItemRanks: 4,
    maxDrifLevel: 11
  },
  {
    tier: 3,
    minItemRanks: 7,
    maxDrifLevel: 16
  },
  {
    tier: 4,
    minItemRanks: 10,
    maxDrifLevel: 21
  },
];

export default drifTiers;
