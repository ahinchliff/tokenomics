import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";
import * as staticServe from "koa-static";
import * as mount from "koa-mount";
import routes from "./routes";
import { Services } from "./services/services";

const initApp = (
  config: api.Config,
  services: (logger: api.Logger) => Services
): Koa => {
  const app = new Koa();

  if (config.environment === "production") {
    const reactApp = new Koa();
    reactApp.use(staticServe(__dirname + "/static"));
    app.use(mount("/", reactApp));
  }

  app.use(cors());
  app.use(bodyParser());
  routes(app, config, services);

  return app;
};

export default initApp;
