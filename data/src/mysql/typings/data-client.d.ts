declare namespace data {
  interface DataClients {
    dbTransaction: data.IDBTransactionClient;
    makerFlapAuction: data.MakerFlapAuctionClient;
    makerFlapAuctionBid: data.MakerFlapAuctionBidClient;
    makerRevenueFromInterest: data.MakerRevenueFromInterestClient;
    makerRevenueFromPSM: data.MakerRevenueFromPSMClient;
    makerFlipAuction: data.MakerFlipAuctionClient;
    makerFlipAuctionBid: data.MakerFlipAuctionBidClient;
  }
}
