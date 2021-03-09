const toApiMakerFlapAuctions = (
  auctions: data.MakerFlapAuction[],
  bids: data.MakerFlapAuctionBid[]
): api.MakerFlapAuction[] => {
  const apiBids: api.MakerFlapAuctionBid[] = bids.map((b) => ({
    id: b.makerFlapAuctionBidId,
    auctionId: b.makerFlapAuctionId,
    ttl: b.ttl,
    bid: b.bid,
    blockNumber: b.blockNumber,
    timestamp: b.timestamp,
    transactionHash: b.transactionHash,
    senderAddress: b.senderAddress,
    gasUsed: b.gasUsed,
    mkrPrice: b.mkrPrice,
  }));

  const bidByAuctionId = apiBids.reduce(
    (
      progress: { [key: number]: api.MakerFlapAuctionBid[] },
      next: api.MakerFlapAuctionBid
    ) => {
      const existingResults = progress[next.auctionId];
      let newResults;

      if (existingResults) {
        newResults = [...existingResults, next];
      } else {
        newResults = [next];
      }

      return {
        ...progress,
        [next.auctionId]: newResults.sort(
          (a, b) => b.blockNumber - a.blockNumber
        ),
      };
    },
    {}
  );

  const apiAictions: api.MakerFlapAuction[] = auctions.map((a) => ({
    id: a.makerFlapAuctionId,
    lot: a.lot,
    kick: {
      blockNumber: a.kickBlockNumber,
      timestamp: a.kickTimestamp,
      transactionHash: a.kickTransactionHash,
      senderAddress: a.kickSenderAddress,
      gasUsed: a.kickGasUsed,
    },
    deal: {
      blockNumber: a.dealBlockNumber,
      timestamp: a.dealTimestamp,
      transactionHash: a.dealTransactionHash,
      senderAddress: a.dealSenderAddress,
      gasUsed: a.dealGasUsed,
      mkrPrice: a.mkrPriceWhenAuctionEnded,
    },
    bids: bidByAuctionId[a.makerFlapAuctionId],
  }));

  return apiAictions;
};

export default toApiMakerFlapAuctions;
