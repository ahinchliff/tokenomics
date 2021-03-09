import { createServer as createHttpServer } from "http";
import { Server as WebSocketServer } from "ws";
import initApp from "./app";
import * as mysql from "../../data/build/mysql";
import Logger from "../../core-backend/build/logger";
import { initServices } from "./services";
import config from "./config";

(async () => {
  const logger = new Logger(config.environment);

  const mysqlPool = await mysql.initialise(config.mysql, logger);

  const http = createHttpServer();

  const ws = new WebSocketServer({
    server: http,
    clientTracking: true,
  });

  const services = await initServices(config, ws, mysqlPool);

  const app = initApp(config, services);

  http.on("request", app.callback());

  http.listen(config.port, () => {
    logger.debug(`App listening on ${config.port}`);
  });
})();
