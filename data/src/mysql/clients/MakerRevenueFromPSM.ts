import { Pool, RowDataPacket } from "mysql2/promise";
import * as sqlBricks from "sql-bricks";
import { rowExtractor, column } from "./utils";
import EntityClientBase from "./base/EntityClientBase";

export default class MakerRevenueFromPSMClient
  extends EntityClientBase<
    "makerRevenueFromPSM",
    data.MakerRevenueFromPSM,
    data.NewMakerRevenueFromPSM
  >
  implements data.MakerRevenueFromPSMClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super(
      "makerRevenueFromPSM",
      pool,
      logger,
      logValues,
      mapper,
      "makerRevenueFromPSMId"
    );
  }

  public last20Swaps = async (
    t?: data.IDBTransaction
  ): Promise<data.MakerRevenueFromPSM[]> => {
    const sql = sqlBricks
      .select()
      .from(this.tableName)
      .orderBy(`${column("makerRevenueFromPSM")("timestamp")} DESC LIMIT 20`);

    const result = await this.query(sql, t);

    return result[0].map(mapper);
  };
}

const mapper = (row: RowDataPacket): data.MakerRevenueFromPSM => {
  const extractor = rowExtractor("makerRevenueFromPSM", row);
  return {
    makerRevenueFromPSMId: extractor("makerRevenueFromPSMId"),
    blockNumber: extractor("blockNumber"),
    timestamp: extractor("timestamp"),
    transactionHash: extractor("transactionHash"),
    action: extractor("action"),
    gem: extractor("gem"),
    gemAmount: extractor("gemAmount"),
    revenue: extractor("revenue"),
    sender: extractor("sender"),
  };
};
