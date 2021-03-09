import { ethers } from "ethers";
import config from "./config";
import * as mysql from "../../data/build/mysql";
import Logger from "../../core-backend/build/logger";
import { fetchAndProcessPastCatBiteEvents } from "./projects/maker";
import Api from "../../core-backend/build/clients/api-client";

(async () => {
  const logger = new Logger("development", "api-init");

  const mysqlPool = await mysql.initialise(config.mysql, logger);

  const mysqlClients = mysql.getClients(mysqlPool, logger, true);
  const provider = new ethers.providers.JsonRpcProvider(
    config.alchemy.baseUrl + "/" + config.alchemy.apiKey
  );

  const api = new Api();

  fetchAndProcessPastCatBiteEvents(
    9657598,
    12000875,
    200000,
    provider,
    mysqlClients,
    api
  );

  // fetchAndProcessPastFlipTendEvents(
  //   8974569,
  //   8984569,
  //   2000000,
  //   provider,
  //   mysqlClients,
  //   api
  // );
})();
