const toApiMakerInterestRevenue = (
  a: data.MakerRevenueFromInterest
): api.MakerRevenueFromInterest => {
  return {
    id: a.makerRevenueFromInterestId,
    blockNumber: a.blockNumber,
    collateralType: a.collateralType,
    sender: a.sender,
    transactionHash: a.transactionHash,
    timestamp: a.timestamp,
    revenue: Number(Number(a.revenue).toFixed(2)),
  };
};

export default toApiMakerInterestRevenue;
