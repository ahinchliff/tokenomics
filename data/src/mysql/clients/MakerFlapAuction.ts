import { Pool, RowDataPacket } from "mysql2/promise";
import * as sqlBricks from "sql-bricks";
import { rowExtractor, column } from "./utils";
import EntityClientBase from "./base/EntityClientBase";

export default class MakerFlapAuctionClient
  extends EntityClientBase<
    "makerFlapAuction",
    data.MakerFlapAuction,
    data.NewMakerFlapAuction
  >
  implements data.MakerFlapAuctionClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super(
      "makerFlapAuction",
      pool,
      logger,
      logValues,
      mapper,
      "makerFlapAuctionId"
    );
  }

  public leaderBoard = async (
    t?: data.IDBTransaction
  ): Promise<data.MakerFlapLeaderBoardItem[]> => {
    const sql = sqlBricks
      .select(`makerFlapAuction_dealSenderAddress AS address, COUNT(*) AS wins`)
      .from(this.tableName)
      .groupBy(column("makerFlapAuction")("dealSenderAddress"))
      .orderBy("wins DESC");

    const result = await this.query(sql, t);

    return (result[0] as unknown) as data.MakerFlapLeaderBoardItem[];
  };

  public numberOfAuctions = async (
    t?: data.IDBTransaction
  ): Promise<number> => {
    const sql = sqlBricks.select(`COUNT(*) as count`).from(this.tableName);

    const result = await this.query(sql, t);

    return ((result[0][0] as unknown) as { count: number }).count;
  };

  public numberOfAuctionsWhereKickerIsWinner = async (
    t?: data.IDBTransaction
  ): Promise<number> => {
    const sql = sqlBricks
      .select(`COUNT(*) as count`)
      .from(this.tableName)
      .where(
        sqlBricks(
          `${column("makerFlapAuction")("kickSenderAddress")} = ${column(
            "makerFlapAuction"
          )("dealSenderAddress")}`
        )
      );

    const result = await this.query(sql, t);

    return ((result[0][0] as unknown) as { count: number }).count;
  };

  public totalDaiAuctioned = async (
    t?: data.IDBTransaction
  ): Promise<number> => {
    const sql = sqlBricks
      .select(`SUM(${column("makerFlapAuction")("lot")}) AS total`)
      .from(this.tableName);

    const result = await this.query(sql, t);

    return Number(((result[0][0] as unknown) as { total: number }).total);
  };

  public totalMakerBurned = async (
    t?: data.IDBTransaction
  ): Promise<number> => {
    const sql = sqlBricks.select(`
    SUM(myBidForEachAuction.maxbid
      ) as totalMKRBurned FROM (SELECT
          MAX(makerFlapAuctionBid_bid) as maxbid
      FROM
          makerFlapAuctionBid
      GROUP BY
          makerFlapAuctionBid_makerFlapAuctionId) as myBidForEachAuction`);

    const result = await this.query(sql, t);

    return Number(
      ((result[0][0] as unknown) as { totalMKRBurned: number }).totalMKRBurned
    );
  };

  public auctionCountByMonth = async (
    t?: data.IDBTransaction
  ): Promise<{ month: number; year: number; count: number }[]> => {
    const sql = sqlBricks.select(`
	    MONTH(makerFlapAuction.makerFlapAuction_kickTimestamp) AS month,
	    YEAR(makerFlapAuction.makerFlapAuction_kickTimestamp) AS year,
	    COUNT(*) as count
      FROM makerFlapAuction
      GROUP BY MONTH(makerFlapAuction.makerFlapAuction_kickTimestamp), YEAR(makerFlapAuction.makerFlapAuction_kickTimestamp)`);

    const result = await this.query(sql, t);

    return result[0] as { month: number; year: number; count: number }[];
  };

  public numberOfBidsFrequency = async (
    t?: data.IDBTransaction
  ): Promise<{ numberOfBids: number; frequency: number }[]> => {
    const sql = sqlBricks.select(`
    numberOfBids, count(numberOfBids) as frequency FROM (
      SELECT count(bids.makerFlapAuctionBid_makerFlapAuctionId) AS numberOfBids 
      FROM makerFlapAuction
      AS auctions 
      LEFT JOIN makerFlapAuctionBid AS bids ON auctions.makerFlapAuction_makerFlapAuctionId = bids.makerFlapAuctionBid_makerFlapAuctionId 
      GROUP BY bids.makerFlapAuctionBid_makerFlapAuctionId
    ) as counts group by numberOfBids`);

    const result = await this.query(sql, t);

    return result[0] as { numberOfBids: number; frequency: number }[];
  };

  public uniqueBidders = async (t?: data.IDBTransaction): Promise<number> => {
    const sql = sqlBricks.select(`
   COUNT(DISTINCT(makerFlapAuctionBid_senderAddress)) AS count FROM makerFlapAuctionBid `);

    const result = await this.query(sql, t);

    return ((result[0][0] as unknown) as { count: number }).count;
  };

  public withdrawTimesAfterWinning = async (
    t?: data.IDBTransaction
  ): Promise<{
    "< 1 minute": number;
    "1-5 minutes": number;
    "5-10 minutes": number;
    "10-20 minutes": number;
    "20-60 minutes": number;
    "> 60 minutes": number;
  }> => {
    const sql = sqlBricks.select(`
    COUNT(
      CASE WHEN 0 <= seconds.difference
        AND seconds.difference <= 60 THEN
        seconds.difference
      END) AS '< 1 minute',
    COUNT(
      CASE WHEN 60 <= seconds.difference
        AND seconds.difference <= 300 THEN
        seconds.difference
      END) AS '1-5 minutes',
    COUNT(
      CASE WHEN 300 <= seconds.difference
        AND seconds.difference <= 600 THEN
        seconds.difference
      END) AS '5-10 minutes',
    COUNT(
      CASE WHEN 600 <= seconds.difference
        AND seconds.difference <= 1200 THEN
        seconds.difference
      END) AS '10-20 minutes',
    COUNT(
      CASE WHEN 1200 <= seconds.difference
        AND seconds.difference <= 3600 THEN
        seconds.difference
      END) AS '20-60 minutes',
    COUNT(
      CASE WHEN 3600 <= seconds.difference THEN
        seconds.difference
      END) AS '> 60 minutes'
    FROM (
    SELECT
      TIMESTAMPDIFF(SECOND, withdrawTimes.couldwithdraw, withdrawTimes.didWithdraw) AS difference
    FROM (
      SELECT
        maxBids.auctionId,
        TIMESTAMPADD(SECOND, makerFlapAuctionBid_ttl, makerFlapAuctionBid_timestamp) AS couldWithdraw,
        makerFlapAuction_dealTimestamp AS didWithdraw
      FROM (
        SELECT
          makerFlapAuctionBid_makerFlapAuctionId AS auctionId,
          MAX(makerFlapAuctionBid_bid) AS maxBid
        FROM
          makerFlapAuctionBid
        GROUP BY
          makerFlapAuctionBid_makerFlapAuctionId) AS maxBids
      LEFT JOIN makerFlapAuction ON makerFlapAuction_makerFlapAuctionId = maxBids.auctionId
      LEFT JOIN makerFlapAuctionBid ON makerFlapAuctionBid_bid = maxBids.maxBid
        AND makerFlapAuctionBid_makerFlapAuctionId = maxBids.auctionId) AS withdrawTimes) AS seconds
    `);

    const result = await this.query(sql, t);

    return (result[0][0] as unknown) as any;
  };
}

const mapper = (row: RowDataPacket): data.MakerFlapAuction => {
  const makerFlapAuction = rowExtractor("makerFlapAuction", row);
  return {
    makerFlapAuctionId: makerFlapAuction("makerFlapAuctionId"),
    lot: makerFlapAuction("lot"),
    kickBlockNumber: makerFlapAuction("kickBlockNumber"),
    kickTimestamp: makerFlapAuction("kickTimestamp"),
    kickTransactionHash: makerFlapAuction("kickTransactionHash"),
    kickSenderAddress: makerFlapAuction("kickSenderAddress"),
    kickGasUsed: makerFlapAuction("kickGasUsed"),
    kickGasPrice: makerFlapAuction("kickGasPrice"),
    kickEthPrice: makerFlapAuction("kickEthPrice"),
    kickEthPriceAccuracy: makerFlapAuction("kickEthPriceAccuracy"),
    dealBlockNumber: makerFlapAuction("dealBlockNumber"),
    dealTimestamp: makerFlapAuction("dealTimestamp"),
    dealTransactionHash: makerFlapAuction("dealTransactionHash"),
    dealSenderAddress: makerFlapAuction("dealSenderAddress"),
    dealGasUsed: makerFlapAuction("dealGasUsed"),
    dealEthPrice: makerFlapAuction("dealGasUsed"),
    dealEthPriceAccuracy: makerFlapAuction("dealEthPriceAccuracy"),
    mkrPriceWhenAuctionEnded: makerFlapAuction("mkrPriceWhenAuctionEnded"),
    mkrPriceWhenAuctionEndedAccuracy: makerFlapAuction(
      "mkrPriceWhenAuctionEndedAccuracy"
    ),
  };
};
