import * as Koa from "koa";
import * as Router from "@koa/router";
import Logger from "../services/logger";
import { addErrorToContext, notAuthorized } from "../utils/errorsUtils";
import { Services } from "../services/services";

export type RequestHandlerPayload<Params, QueryString, Body> = {
  config: api.Config;
  logger: api.Logger;
  services: Services;
  params: Params;
  queryString: QueryString;
  body: Body;
};

export type RequestHandler<Params, QueryString, Body, Result extends Object> = (
  payload: RequestHandlerPayload<Params, QueryString, Body>
) => Promise<Result | api.ErrorResponse>;

const getDecodedJWT = async (
  ctx: Koa.Context,
  services: Services,
  logger: api.Logger
): Promise<{} | undefined> => {
  const authToken = ctx.get("Authorization");
  const split = authToken && authToken.split && authToken.split("Bearer ");
  const token = split && split[1];
  return services.auth.decodeJWT(token, logger);
};

const handlerBuilder = (
  config: api.Config,
  getServices: (logger: api.Logger) => Services,
  handler: RequestHandler<any, any, any, any>,
  authRequired: boolean
): Router.Middleware => async (ctx, next) => {
  const logger = new Logger(config.environment);
  const start = Date.now();
  logger.debug(`----> ${ctx.method} ${ctx.url}`);

  const services = getServices(logger);

  const decodedJWT = await getDecodedJWT(ctx, services, logger);

  if (authRequired && !decodedJWT) {
    addErrorToContext(ctx, notAuthorized());
  } else {
    const payload: RequestHandlerPayload<any, any, any> = {
      services,
      logger,
      config,
      params: ctx.params,
      queryString: ctx.querystring,
      body: ctx.request.body,
    };

    const result = await handler(payload);
    if (result.hasOwnProperty("statusCode")) {
      addErrorToContext(ctx, result);
    } else {
      ctx.status = 200;
      ctx.body = result;
    }
  }
  const end = Date.now();
  logger.debug(`<---- ${ctx.method} ${ctx.url} ${ctx.status} ${end - start}ms`);
  next();
};

const getBuilder = <Handler extends RequestHandler<any, any, any, any>>(
  requiresAuth: boolean
) => (config: api.Config, getServices: (logger: api.Logger) => Services) => (
  handler: Handler
) => handlerBuilder(config, getServices, handler, requiresAuth);

export const authBuilder = getBuilder<RequestHandler<any, any, any, any>>(true);
export const noAuthBuilder = getBuilder<RequestHandler<any, any, any, any>>(
  false
);
