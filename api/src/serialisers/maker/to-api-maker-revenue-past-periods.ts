const toApiMakerRevenuePastPeriods = (
  a: data.RevenueCollectedPastPeriods
): api.Maker30DayRevenueStats => {
  return {
    interest: {
      last30Days: Number(Number(a.interestPast30).toFixed(2)),
      previous30Days: Number(Number(a.interestPrevious30).toFixed(2)),
    },
    trade: {
      last30Days: Number(Number(a.tradePast30).toFixed(2)),
      previous30Days: Number(Number(a.tradePrevious30).toFixed(2)),
    },
  };
};

export default toApiMakerRevenuePastPeriods;
