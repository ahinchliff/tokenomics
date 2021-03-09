declare namespace data {
  type MakerFlapAuctionBid = Pick<
    data.MakerFlapAuctionBidTable,
    | "makerFlapAuctionBidId"
    | "makerFlapAuctionId"
    | "bid"
    | "blockNumber"
    | "timestamp"
    | "transactionHash"
    | "senderAddress"
    | "ttl"
    | "gasUsed"
    | "gasPrice"
    | "ethPrice"
    | "ethPriceAccuracy"
    | "mkrPrice"
    | "mkrPriceAccuracy"
  >;

  type NewMakerFlapAuctionBid = Omit<
    MakerFlapAuctionBid,
    "makerFlapAuctionBidId"
  >;

  interface MakerFlapAuctionBidClient
    extends data.EntityClientBase<
      data.MakerFlapAuctionBidTable,
      NewMakerFlapAuctionBid,
      MakerFlapAuctionBid
    > {}
}
