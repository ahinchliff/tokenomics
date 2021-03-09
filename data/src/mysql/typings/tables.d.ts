declare namespace data {
  type PriceAccuracy = "minute" | "hour" | "day";
  type MakerFlapAuctionTable = {
    makerFlapAuctionId: number;
    lot: string;
    kickBlockNumber: number;
    kickTimestamp: Date;
    kickTransactionHash: string;
    kickSenderAddress: string;
    kickGasUsed: number;
    kickGasPrice: number;
    kickEthPrice: number;
    kickEthPriceAccuracy: PriceAccuracy;
    dealBlockNumber: number | undefined;
    dealTimestamp: Date | undefined;
    dealTransactionHash: string | undefined;
    dealSenderAddress: string | undefined;
    dealGasUsed: number | undefined;
    dealGasPrice: number | undefined;
    dealEthPrice: number | undefined;
    dealEthPriceAccuracy: PriceAccuracy;
    mkrPriceWhenAuctionEnded: number | undefined;
    mkrPriceWhenAuctionEndedAccuracy: PriceAccuracy;
  };

  type MakerFlapAuctionBidTable = {
    makerFlapAuctionBidId: number;
    makerFlapAuctionId: number;
    bid: string;
    blockNumber: number;
    timestamp: Date;
    transactionHash: string;
    senderAddress: string;
    ttl: number;
    gasUsed: number;
    gasPrice: number;
    ethPrice: number;
    ethPriceAccuracy: PriceAccuracy;
    mkrPrice: number;
    mkrPriceAccuracy: PriceAccuracy;
  };

  type MakerRevenueFromInterestTable = {
    makerRevenueFromInterestId: number;
    blockNumber: number;
    collateralType: string;
    revenue: string;
    sender: string;
    transactionHash: string;
    timestamp: Date;
  };

  type MakerRevenueFromPSMTable = {
    makerRevenueFromPSMId: number;
    blockNumber: number;
    action: "buy" | "sell";
    gem: string;
    gemAmount: string;
    revenue: string;
    sender: string;
    transactionHash: string;
    timestamp: Date;
  };

  type MakerFlipAuctionTable = {
    makerFlipAuctionId: number;
    urnAddress: string;
    collateralType: string;
    debt: string;
    liquidationPenalty: number;
    kickBlockNumber: number;
    kickTimestamp: Date;
    kickTransactionHash: string;
    kickSender: string;
  };

  type MakerFlipAuctionBidTable = {
    makerFlipAuctionBidId: number;
    makerFlipAuctionId: number;
    bid: string;
    ttl: number;
    blockNumber: number;
    timestamp: Date;
    transactionHash: string;
    sender: string;
  };

  type MakerFlapAuctionColumns = keyof MakerFlapAuctionTable;
  type MakerFlapAuctionBidColumns = keyof MakerFlapAuctionBidTable;
  type MakerRevenueFromInterestColumns = keyof MakerRevenueFromInterestTable;
  type MakerRevenueFromPSMColumns = keyof MakerRevenueFromPSMTable;
  type MakerFlipAuctionColumns = keyof MakerFlipAuctionTable;
  type MakerFlipAuctionBidColumns = keyof MakerFlipAuctionBidTable;

  interface ITables {
    makerFlapAuction: { [key in MakerFlapAuctionColumns]: unknown };
    makerFlapAuctionBid: { [key in MakerFlapAuctionBidColumns]: unknown };
    makerRevenueFromInterest: {
      [key in MakerRevenueFromInterestColumns]: unknown;
    };
    makerRevenueFromPSM: {
      [key in MakerRevenueFromPSMColumns]: unknown;
    };
    makerFlipAuction: { [key in MakerFlipAuctionColumns]: unknown };
    makerFlipAuctionBid: { [key in MakerFlipAuctionBidColumns]: unknown };
  }
}
