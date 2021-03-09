import { RequestHandler } from "../handlerBuilders";
import toApiMakerInterestRevenue from "../../serialisers/maker/to-api-maker-interest-revenue";

const getInterestRevenueStats: RequestHandler<
  {},
  {},
  {},
  api.MakerInterestRevenueStats
> = async ({ services }) => {
  const revenueByCollateralByMonth = await services.mysql.makerRevenueFromInterest.revenueByCollateralByMonth();
  const topRevenueCollectorsData = await services.mysql.makerRevenueFromInterest.topRevenueCollectors();
  const last20DripsData = await services.mysql.makerRevenueFromInterest.last20Drips();
  const revenueByDay = await services.mysql.makerRevenueFromInterest.revenueByDay();

  const interestRevenueByCollateralByMonth = revenueByCollateralByMonth.reduce(
    (
      progress: api.MakerInterestRevenueByCollateralByMonth[],
      next: data.RevenueFromInterestByCollateralByMonth
    ) => {
      const monthAndYearIndex = progress.findIndex(
        (rcbm) => rcbm.month === next.month && rcbm.year === next.year
      );

      if (monthAndYearIndex < 0) {
        return [
          ...progress,
          {
            month: next.month,
            year: next.year,
            collaterals: [
              {
                name: next.collateral,
                revenue: Number(Number(next.revenue).toFixed(2)),
              },
            ],
          },
        ];
      } else {
        const monthAndYear = progress[monthAndYearIndex];
        const updatedMonthAndYearCollaterals = [
          ...monthAndYear.collaterals,
          {
            name: next.collateral,
            revenue: Number(Number(next.revenue).toFixed(2)),
          },
        ];

        const updatedMonthAndYear = {
          ...monthAndYear,
          collaterals: updatedMonthAndYearCollaterals,
        };

        progress.splice(monthAndYearIndex, 1, updatedMonthAndYear);

        return progress;
      }
    },
    []
  );

  const topRevenueCollectors = topRevenueCollectorsData.map((tr) => ({
    revenue: Number(Number(tr.revenue).toFixed(2)),
    drips: Number(Number(tr.drips).toFixed(2)),
    address: tr.address,
  }));

  const last20Drips = last20DripsData.map(toApiMakerInterestRevenue);

  const interestRevenueByDay = revenueByDay.map((d) => {
    return {
      date: d.date,
      revenue: Number(d.revenue),
    };
  });

  const result: api.MakerInterestRevenueStats = {
    interestRevenueByCollateralByMonth,
    topRevenueCollectors,
    last20Drips,
    interestRevenueByDay,
  };

  return result;
};

export default getInterestRevenueStats;
