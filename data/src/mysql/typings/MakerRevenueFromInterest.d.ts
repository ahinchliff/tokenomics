declare namespace data {
  type MakerRevenueFromInterest = Pick<
    data.MakerRevenueFromInterestTable,
    | "makerRevenueFromInterestId"
    | "blockNumber"
    | "collateralType"
    | "revenue"
    | "timestamp"
    | "transactionHash"
    | "sender"
  >;

  type NewMakerRevenueFromInterest = Omit<
    MakerRevenueFromInterest,
    "makerRevenueFromInterestId"
  >;

  type RevenueFromInterestByCollateralByMonth = {
    month: number;
    year: number;
    collateral: string;
    revenue: string;
  };

  type MakerRevenueFromInterestByDay = {
    date: Date;
    revenue: string;
  };

  type RevenueCollector = {
    address: string;
    revenue: string;
    drips: string;
  };

  type RevenueCollectedPastPeriods = {
    interestPast30: string;
    interestPrevious30: string;
    tradePast30: string;
    tradePrevious30: string;
  };

  interface MakerRevenueFromInterestClient
    extends data.EntityClientBase<
      data.MakerRevenueFromInterestTable,
      NewMakerRevenueFromInterest,
      MakerRevenueFromInterest
    > {
    last20Drips(
      t?: data.IDBTransaction
    ): Promise<data.MakerRevenueFromInterest[]>;
    revenueByCollateralByMonth(
      t?: data.IDBTransaction
    ): Promise<RevenueFromInterestByCollateralByMonth[]>;
    topRevenueCollectors(
      t?: data.IDBTransaction
    ): Promise<data.RevenueCollector[]>;
    revenueByDay(
      t?: data.IDBTransaction
    ): Promise<data.MakerRevenueFromInterestByDay[]>;
    thirtyDayPeriodRevenue(
      t?: data.IDBTransaction
    ): Promise<RevenueCollectedPastPeriods>;
  }
}
