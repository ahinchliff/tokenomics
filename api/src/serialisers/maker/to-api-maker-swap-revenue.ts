const toApiMakerPSMRevenue = (
  a: data.MakerRevenueFromPSM
): api.MakerRevenueFromPSM => {
  return {
    id: a.makerRevenueFromPSMId,
    blockNumber: a.blockNumber,
    gem: a.gem,
    gemAmount: Number(Number(a.gemAmount).toFixed(2)),
    timestamp: a.timestamp,
    revenue: Number(Number(a.revenue).toFixed(2)),
  };
};

export default toApiMakerPSMRevenue;
