import { ethers } from "ethers";
import { Server as WebSocketServer } from "ws";
import * as mysql from "../../../data/build/mysql";
import AuthService from "./auth";
import { Services } from "./services";
import SocketService from "./socket";

export const initServices = async (
  config: api.Config,
  wsServer: WebSocketServer,
  mysqlPool: mysql.Pool
): Promise<(logger: api.Logger) => Services> => {
  return (logger: api.Logger): Services => {
    const provider = new ethers.providers.JsonRpcProvider(
      config.alchemy.baseUrl + "/" + config.alchemy.apiKey
    );

    return {
      auth: new AuthService(config.jwt),
      socket: new SocketService(wsServer),
      mysql: mysql.getClients(mysqlPool, logger, true),
      provider,
    };
  };
};
