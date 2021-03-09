import { Pool, RowDataPacket } from "mysql2/promise";
import EntityClientBase from "./base/EntityClientBase";
import { rowExtractor } from "./utils";

export default class MakerFlapAuctionBidClient
  extends EntityClientBase<
    "makerFlapAuctionBid",
    data.MakerFlapAuctionBid,
    data.NewMakerFlapAuctionBid
  >
  implements data.MakerFlapAuctionBidClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super(
      "makerFlapAuctionBid",
      pool,
      logger,
      logValues,
      mapper,
      "makerFlapAuctionBidId"
    );
  }
}

const mapper = (row: RowDataPacket): data.MakerFlapAuctionBid => {
  const makerFlapAuctionBid = rowExtractor("makerFlapAuctionBid", row);
  return {
    makerFlapAuctionBidId: makerFlapAuctionBid("makerFlapAuctionBidId"),
    makerFlapAuctionId: makerFlapAuctionBid("makerFlapAuctionId"),
    bid: makerFlapAuctionBid("bid"),
    ttl: makerFlapAuctionBid("ttl"),
    blockNumber: makerFlapAuctionBid("blockNumber"),
    timestamp: makerFlapAuctionBid("timestamp"),
    transactionHash: makerFlapAuctionBid("transactionHash"),
    senderAddress: makerFlapAuctionBid("senderAddress"),
    gasUsed: makerFlapAuctionBid("gasUsed"),
    gasPrice: makerFlapAuctionBid("gasPrice"),
    ethPrice: makerFlapAuctionBid("ethPrice"),
    ethPriceAccuracy: makerFlapAuctionBid("ethPriceAccuracy"),
    mkrPrice: makerFlapAuctionBid("mkrPrice"),
    mkrPriceAccuracy: makerFlapAuctionBid("mkrPriceAccuracy"),
  };
};
