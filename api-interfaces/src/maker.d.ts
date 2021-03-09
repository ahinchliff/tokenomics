declare namespace api {
  type MakerFlapAuction = {
    id: number;
    lot: string;
    kick: {
      blockNumber: number;
      timestamp: Date;
      transactionHash: string;
      senderAddress: string;
      gasUsed: number;
    };
    deal: {
      blockNumber: number | undefined;
      timestamp: Date | undefined;
      transactionHash: string | undefined;
      senderAddress: string | undefined;
      gasUsed: number | undefined;
      mkrPrice: number | undefined;
    };
    bids: MakerFlapAuctionBid[];
  };

  type MakerFlapAuctionBid = {
    id: number;
    auctionId: number;
    bid: string;
    ttl: number;
    blockNumber: number;
    timestamp: Date;
    transactionHash: string;
    senderAddress: string;
    gasUsed: number;
    mkrPrice: number;
  };

  type MakerFlapAuctionStats = {
    numberOfAuctions: number;
    numberOfAuctionsWhereKickerIsWinner: number;
    totalDaiAuctioned: number;
    totalMakerBurned: number;
    uniqueBidders: number;
    auctionCountByMonth: { month: number; year: number; count: number }[];
    withdrawTimesAfterWinning: {
      "< 1 minute": number;
      "1-5 minutes": number;
      "5-10 minutes": number;
      "10-20 minutes": number;
      "20-60 minutes": number;
      "> 60 minutes": number;
    };
    leaderBoard: { address: string; wins: number }[];
    numberOfBidsFrequency: { numberOfBids: number; frequency: number }[];
  };

  type MakerCollateralRatio = {
    collateral: string;
    dai: number;
  }[];

  type MakerInterestRevenueByCollateralByMonth = {
    month: number;
    year: number;
    collaterals: { name: string; revenue: number }[];
  };

  type MakerTopRevenueCollectors = {
    address: string;
    revenue: number;
    drips: number;
  };

  type MakerRevenueFromInterest = {
    id: number;
    blockNumber: number;
    collateralType: string;
    revenue: number;
    sender: string;
    transactionHash: string;
    timestamp: Date;
  };

  type MakerRevenueByDay = {
    date: Date;
    revenue: number;
  };

  type MakerInterestRevenueStats = {
    interestRevenueByCollateralByMonth: MakerInterestRevenueByCollateralByMonth[];
    topRevenueCollectors: MakerTopRevenueCollectors[];
    last20Drips: MakerRevenueFromInterest[];
    interestRevenueByDay: MakerRevenueByDay[];
  };

  type MakerRevenueFromPSM = {
    id: number;
    blockNumber: number;
    gem: string;
    gemAmount: number;
    revenue: number;
    timestamp: Date;
  };

  type PSMRevenueStats = {
    last20Swaps: MakerRevenueFromPSM[];
  };

  type MakerSocketEvent =
    | { event: "interestRevenue"; data: MakerRevenueFromInterest }
    | { event: "tradeRevenue"; data: MakerRevenueFromPSM };

  type Maker30DayRevenueStats = {
    interest: {
      last30Days: number;
      previous30Days: number;
    };
    trade: {
      last30Days: number;
      previous30Days: number;
    };
  };
}
