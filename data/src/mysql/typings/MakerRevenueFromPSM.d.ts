declare namespace data {
  type MakerRevenueFromPSM = Pick<
    data.MakerRevenueFromPSMTable,
    | "makerRevenueFromPSMId"
    | "blockNumber"
    | "action"
    | "gem"
    | "gemAmount"
    | "revenue"
    | "timestamp"
    | "transactionHash"
    | "sender"
  >;

  type NewMakerRevenueFromPSM = Omit<
    MakerRevenueFromPSM,
    "makerRevenueFromPSMId"
  >;

  interface MakerRevenueFromPSMClient
    extends data.EntityClientBase<
      data.MakerRevenueFromPSMTable,
      NewMakerRevenueFromPSM,
      MakerRevenueFromPSM
    > {
    last20Swaps(t?: data.IDBTransaction): Promise<data.MakerRevenueFromPSM[]>;
  }
}
