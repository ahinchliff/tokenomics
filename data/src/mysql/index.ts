// tslint:disable:no-submodule-imports
import { PoolConnection, createPool, Pool } from "mysql2/promise";
import MysqlDBTransactionClient from "./clients/DBTransaction";
import MakerFlapAuctionClient from "./clients/MakerFlapAuction";
import MakerFlapAuctionBidClient from "./clients/MakerFlapAuctionBid";
import MakerFlipAuctionClient from "./clients/MakerFlipAuction";
import MakerFlipAuctionBidClient from "./clients/MakerFlipAuctionBid";
import MakerRevenueFromInterestClient from "./clients/MakerRevenueFromInterest";
import MakerRevenueFromPSMClient from "./clients/MakerRevenueFromPSM";

export { Pool };

export async function initialise(
  config: data.IMysqlConfig,
  logger: core.backend.Logger
): Promise<Pool> {
  logger.debug("Creating MySQL pool");
  return new Promise(
    (resolve: (pool: Pool | PromiseLike<Pool>) => void): void => {
      const pool = createPool({
        connectionLimit: config.connectionLimit,
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        timezone: "+00:00",
      });

      pool.getConnection().then(
        (conn: PoolConnection): void => {
          conn.release();
          logger.debug("Successfully created MySQL pool");
          resolve(pool);
        },
        (err: Error): void => {
          logger.error("Error creating MySQL pool. Retrying...", err);
          setTimeout(() => resolve(initialise(config, logger)), 4000);
        }
      );
    }
  );
}

export const getClients = (
  pool: Pool,
  logger: core.backend.Logger,
  logValues: boolean
): data.DataClients => ({
  dbTransaction: new MysqlDBTransactionClient(pool, logger),
  makerFlapAuction: new MakerFlapAuctionClient(pool, logger, logValues),
  makerFlapAuctionBid: new MakerFlapAuctionBidClient(pool, logger, logValues),
  makerRevenueFromInterest: new MakerRevenueFromInterestClient(
    pool,
    logger,
    logValues
  ),
  makerRevenueFromPSM: new MakerRevenueFromPSMClient(pool, logger, logValues),
  makerFlipAuction: new MakerFlipAuctionClient(pool, logger, logValues),
  makerFlipAuctionBid: new MakerFlipAuctionBidClient(pool, logger, logValues),
});
