import * as Koa from "koa";
import * as Router from "@koa/router";
import { noAuthBuilder } from "./handlerBuilders";
import makerHandlers from "./maker";
import { Services } from "../services/services";

export default (
  app: Koa,
  config: api.Config,
  services: (logger: api.Logger) => Services
): void => {
  // const auth = authBuilder(config, services);
  const unAuth = noAuthBuilder(config, services);

  const makerRouter = new Router({ prefix: "/maker" });
  makerRouter.get(
    "/flap-auction/stats",
    unAuth(makerHandlers.getFlapAuctionStats)
  );
  makerRouter.get("/flap-auction", unAuth(makerHandlers.getFlapAuctions));
  makerRouter.get(
    "/collateral-ratio",
    unAuth(makerHandlers.getCollateralRatio)
  );
  makerRouter.get(
    "/interest-revenue",
    unAuth(makerHandlers.getInterestRevenueStats)
  );

  makerRouter.get("/psm-revenue", unAuth(makerHandlers.getPSMRevenueStats));

  makerRouter.get(
    "/thirty-day-period-revenue",
    unAuth(makerHandlers.getThirtyDayPeriodRevenues)
  );

  makerRouter.post("/new-event", unAuth(makerHandlers.postReceiveNewEvent));

  app.use(makerRouter.routes());
};
