declare namespace data {
  type MakerFlipAuctionBid = Pick<
    data.MakerFlipAuctionBidTable,
    | "makerFlipAuctionBidId"
    | "makerFlipAuctionId"
    | "bid"
    | "ttl"
    | "blockNumber"
    | "timestamp"
    | "transactionHash"
    | "sender"
  >;

  type NewMakerFlipAuctionBid = Omit<
    MakerFlipAuctionBid,
    "makerFlipAuctionBidId"
  >;

  interface MakerFlipAuctionBidClient
    extends data.EntityClientBase<
      data.MakerFlipAuctionBidTable,
      NewMakerFlipAuctionBid,
      MakerFlipAuctionBid
    > {}
}
