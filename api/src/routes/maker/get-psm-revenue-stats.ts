import toApiMakerPSMRevenue from "../../serialisers/maker/to-api-maker-swap-revenue";
import { RequestHandler } from "../handlerBuilders";

const getPSMRevenueStats: RequestHandler<
  {},
  {},
  {},
  api.PSMRevenueStats
> = async ({ services }) => {
  const last20SwapsData = await services.mysql.makerRevenueFromPSM.last20Swaps();

  const last20Swaps = last20SwapsData.map(toApiMakerPSMRevenue);

  const result: api.PSMRevenueStats = {
    last20Swaps,
  };

  return result;
};

export default getPSMRevenueStats;
