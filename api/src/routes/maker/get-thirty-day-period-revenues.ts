import toApiMakerRevenuePastPeriods from "../../serialisers/maker/to-api-maker-revenue-past-periods";
import { RequestHandler } from "../handlerBuilders";

const get30DayRevenueStats: RequestHandler<
  {},
  {},
  {},
  api.Maker30DayRevenueStats
> = async ({ services }) => {
  const result = await services.mysql.makerRevenueFromInterest.thirtyDayPeriodRevenue();

  return toApiMakerRevenuePastPeriods(result);
};

export default get30DayRevenueStats;
