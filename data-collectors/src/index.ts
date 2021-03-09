import { ethers } from "ethers";
import config from "./config";
import { makerListen } from "./projects/maker";
import * as mysql from "../../data/build/mysql";
import Logger from "../../core-backend/build/logger";
import Api from "../../core-backend/build/clients/api-client";

(async () => {
  const logger = new Logger("development", "api-init");

  const mysqlPool = await mysql.initialise(config.mysql, logger);

  const mysqlClients = mysql.getClients(mysqlPool, logger, true);
  const provider = new ethers.providers.JsonRpcProvider(
    config.alchemy.baseUrl + "/" + config.alchemy.apiKey
  );

  const api = new Api();

  makerListen(provider, mysqlClients, api, config);
})();
