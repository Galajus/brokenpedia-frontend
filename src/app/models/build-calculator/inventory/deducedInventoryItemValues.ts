export interface DeducedInventoryItemValues {
  upgradeBoost: number,
  orbBoost: number,
  drifBoost: number
}

const deducedInventoryItemValuesTable: DeducedInventoryItemValues[] = [
  {
    upgradeBoost: 0,
    drifBoost: 0,
    orbBoost: 0,
  },
  {
    upgradeBoost: 0,
    drifBoost: 0,
    orbBoost: 0,
  },
  {
    upgradeBoost: 0,
    drifBoost: 0,
    orbBoost: 0,
  },
  {
    upgradeBoost: 0.1,
    drifBoost: 0,
    orbBoost: 0.05,
  },
  {
    upgradeBoost: 0.15,
    drifBoost: 0,
    orbBoost: 0.1,
  },
  {
    upgradeBoost: 0.25,
    drifBoost: 0,
    orbBoost: 0.2,
  },
  {
    upgradeBoost: 0.5,
    drifBoost: 0.03,
    orbBoost: 0.3,
  },
  {
    upgradeBoost: 0.8,
    drifBoost: 0.08,
    orbBoost: 0.5,
  },
  {
    upgradeBoost: 1,
    drifBoost: 0.15,
    orbBoost: 0.75,
  }
  ];
export default deducedInventoryItemValuesTable;
