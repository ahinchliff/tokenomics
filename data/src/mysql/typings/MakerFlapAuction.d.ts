declare namespace data {
  type MakerFlapAuction = Pick<
    data.MakerFlapAuctionTable,
    | "makerFlapAuctionId"
    | "lot"
    | "kickBlockNumber"
    | "kickTimestamp"
    | "kickTransactionHash"
    | "kickSenderAddress"
    | "kickGasUsed"
    | "kickGasPrice"
    | "kickEthPrice"
    | "kickEthPriceAccuracy"
    | "dealBlockNumber"
    | "dealTimestamp"
    | "dealTransactionHash"
    | "dealSenderAddress"
    | "dealGasUsed"
    | "dealGasUsed"
    | "dealEthPrice"
    | "dealEthPriceAccuracy"
    | "mkrPriceWhenAuctionEnded"
    | "mkrPriceWhenAuctionEndedAccuracy"
  >;

  type NewMakerFlapAuction = Pick<
    MakerFlapAuction,
    | "makerFlapAuctionId"
    | "lot"
    | "kickBlockNumber"
    | "kickTimestamp"
    | "kickTransactionHash"
    | "kickSenderAddress"
    | "kickGasUsed"
    | "kickGasPrice"
    | "kickEthPrice"
    | "kickEthPriceAccuracy"
  >;

  type MakerFlapLeaderBoardItem = {
    address: string;
    wins: number;
  };

  interface MakerFlapAuctionClient
    extends data.EntityClientBase<
      data.MakerFlapAuctionTable,
      NewMakerFlapAuction,
      MakerFlapAuction
    > {
    leaderBoard(
      t?: data.IDBTransaction
    ): Promise<data.MakerFlapLeaderBoardItem[]>;
    numberOfAuctions(t?: data.IDBTransaction): Promise<number>;
    numberOfAuctionsWhereKickerIsWinner(
      t?: data.IDBTransaction
    ): Promise<number>;
    totalDaiAuctioned(t?: data.IDBTransaction): Promise<number>;
    totalMakerBurned(t?: data.IDBTransaction): Promise<number>;
    numberOfBidsFrequency(
      t?: data.IDBTransaction
    ): Promise<{ numberOfBids: number; frequency: number }[]>;
    auctionCountByMonth(
      t?: data.IDBTransaction
    ): Promise<{ month: number; year: number; count: number }[]>;
    uniqueBidders(t?: data.IDBTransaction): Promise<number>;
    withdrawTimesAfterWinning(
      t?: data.IDBTransaction
    ): Promise<{
      "< 1 minute": number;
      "1-5 minutes": number;
      "5-10 minutes": number;
      "10-20 minutes": number;
      "20-60 minutes": number;
      "> 60 minutes": number;
    }>;
  }
}
