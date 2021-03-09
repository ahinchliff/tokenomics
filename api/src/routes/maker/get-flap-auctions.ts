import toApiMakerFlapAuctions from "../../serialisers/maker/to-api-maker-flap-auction";
import { RequestHandler } from "../handlerBuilders";

const getFlapAuctions: RequestHandler<
  {},
  {},
  {},
  api.MakerFlapAuction[]
> = async ({ services }) => {
  const auctions = await services.mysql.makerFlapAuction.getMany({});
  const bids = await services.mysql.makerFlapAuctionBid.getMany({});

  return toApiMakerFlapAuctions(auctions, bids);
};

export default getFlapAuctions;
