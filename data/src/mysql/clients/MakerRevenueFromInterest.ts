import { Pool, RowDataPacket } from "mysql2/promise";
import { column, rowExtractor } from "./utils";
import EntityClientBase from "./base/EntityClientBase";
import * as sqlBricks from "sql-bricks";
export default class MakerRevenueFromInterest
  extends EntityClientBase<
    "makerRevenueFromInterest",
    data.MakerRevenueFromInterest,
    data.NewMakerRevenueFromInterest
  >
  implements data.MakerRevenueFromInterestClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super(
      "makerRevenueFromInterest",
      pool,
      logger,
      logValues,
      mapper,
      "makerRevenueFromInterestId"
    );
  }

  public last20Drips = async (
    t?: data.IDBTransaction
  ): Promise<data.MakerRevenueFromInterest[]> => {
    const sql = sqlBricks
      .select()
      .from(this.tableName)
      .orderBy(
        `${column("makerRevenueFromInterest")("timestamp")} DESC LIMIT 20`
      );

    const result = await this.query(sql, t);

    return result[0].map(mapper);
  };

  public revenueByCollateralByMonth = async (
    t?: data.IDBTransaction
  ): Promise<data.RevenueFromInterestByCollateralByMonth[]> => {
    const sql = sqlBricks.select(`
    MONTH(makerRevenueFromInterest_timestamp) AS month,
    YEAR(makerRevenueFromInterest_timestamp) AS year,
    makerRevenueFromInterest_collateralType AS collateral,
    SUM(makerRevenueFromInterest_revenue) AS revenue FROM makerRevenueFromInterest GROUP BY makerRevenueFromInterest_collateralType, MONTH(makerRevenueFromInterest_timestamp),
      YEAR(makerRevenueFromInterest_timestamp) ORDER BY year ASC, month ASC`);

    const result = await this.query(sql, t);

    return result[0] as data.RevenueFromInterestByCollateralByMonth[];
  };

  public revenueByDay = async (
    t?: data.IDBTransaction
  ): Promise<data.MakerRevenueFromInterestByDay[]> => {
    const sql = sqlBricks.select(`
      DATE(makerRevenueFromInterest_timestamp) AS date,
      SUM(makerRevenueFromInterest_revenue) AS revenue
    FROM
      makerRevenueFromInterest
    GROUP BY
      date
    ORDER BY
      date ASC`);

    const result = await this.query(sql, t);

    return result[0] as data.MakerRevenueFromInterestByDay[];
  };

  public topRevenueCollectors = async (
    t?: data.IDBTransaction
  ): Promise<data.RevenueCollector[]> => {
    const sql = sqlBricks.select(`
    makerRevenueFromInterest_sender AS address,
      SUM(makerRevenueFromInterest_revenue) AS revenue,
      COUNT(*) AS drips
    FROM
      makerRevenueFromInterest
    GROUP BY
      makerRevenueFromInterest_sender
    ORDER BY
      revenue DESC
    LIMIT 20`);

    const result = await this.query(sql, t);

    return result[0] as data.RevenueCollector[];
  };

  public thirtyDayPeriodRevenue = async (
    t?: data.IDBTransaction
  ): Promise<data.RevenueCollectedPastPeriods> => {
    const sql = sqlBricks.select(`
	(
		SELECT
			SUM(makerRevenueFromInterest_revenue)
		FROM
			makerRevenueFromInterest
		WHERE
			makerRevenueFromInterest.makerRevenueFromInterest_timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY)
			AND NOW()) AS interestPast30, (
			SELECT
				SUM(makerRevenueFromInterest_revenue)
			FROM
				makerRevenueFromInterest
			WHERE
				makerRevenueFromInterest.makerRevenueFromInterest_timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY)
				AND DATE_SUB(NOW(), INTERVAL 30 DAY)) AS interestPrevious30, (
				SELECT
					SUM(makerRevenueFromPSM_revenue)
				FROM
					makerRevenueFromPSM
				WHERE
					makerRevenueFromPSM.makerRevenueFromPSM_timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY)
					AND NOW()) AS tradePast30, (
					SELECT
						SUM(makerRevenueFromPSM_revenue)
					FROM
						makerRevenueFromPSM
					WHERE
						makerRevenueFromPSM.makerRevenueFromPSM_timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY)
						AND DATE_SUB(NOW(), INTERVAL 30 DAY)) AS tradePrevious30`);

    const result = await this.query(sql, t);

    return result[0][0] as data.RevenueCollectedPastPeriods;
  };
}

const mapper = (row: RowDataPacket): data.MakerRevenueFromInterest => {
  const extractor = rowExtractor("makerRevenueFromInterest", row);
  return {
    makerRevenueFromInterestId: extractor("makerRevenueFromInterestId"),
    blockNumber: extractor("blockNumber"),
    timestamp: extractor("timestamp"),
    transactionHash: extractor("transactionHash"),
    collateralType: extractor("collateralType"),
    revenue: extractor("revenue"),
    sender: extractor("sender"),
  };
};
