import toApiMakerInterestRevenue from "../../serialisers/maker/to-api-maker-interest-revenue";
import toApiMakerPSMRevenue from "../../serialisers/maker/to-api-maker-swap-revenue";
import { notAuthorized } from "../../utils/errorsUtils";
import { RequestHandler } from "../handlerBuilders";

type Body = {
  password: string;
  event:
    | { event: "tradeRevenue"; data: data.MakerRevenueFromPSM }
    | { event: "interestRevenue"; data: data.MakerRevenueFromInterest };
};

const receiveNewEvent: RequestHandler<
  {},
  {},
  Body,
  { success: boolean }
> = async ({ body, services, config }) => {
  if (body.password !== config.dataCollectorPassword) {
    return notAuthorized();
  }

  if (body.event.event === "interestRevenue") {
    await services.socket.broadcastMakerEvent({
      event: body.event.event,
      data: toApiMakerInterestRevenue(body.event.data),
    });
  }

  if (body.event.event === "tradeRevenue") {
    await services.socket.broadcastMakerEvent({
      event: body.event.event,
      data: toApiMakerPSMRevenue(body.event.data),
    });
  }

  return { success: true };
};

export default receiveNewEvent;
