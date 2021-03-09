declare namespace data {
  type MakerFlipAuction = Pick<
    data.MakerFlipAuctionTable,
    | "makerFlipAuctionId"
    | "urnAddress"
    | "collateralType"
    | "debt"
    | "liquidationPenalty"
    | "kickBlockNumber"
    | "kickTimestamp"
    | "kickTransactionHash"
    | "kickSender"
  >;

  type NewMakerFlipAuction = MakerFlipAuction;

  interface MakerFlipAuctionClient
    extends data.EntityClientBase<
      data.MakerFlipAuctionTable,
      NewMakerFlipAuction,
      MakerFlipAuction
    > {}
}
