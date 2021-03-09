import { Pool, RowDataPacket } from "mysql2/promise";
import { rowExtractor } from "./utils";
import EntityClientBase from "./base/EntityClientBase";

export default class MakerFlipAuctionBidClient
  extends EntityClientBase<
    "makerFlipAuctionBid",
    data.MakerFlipAuctionBid,
    data.NewMakerFlipAuctionBid
  >
  implements data.MakerFlipAuctionBidClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super(
      "makerFlipAuctionBid",
      pool,
      logger,
      logValues,
      mapper,
      "makerFlipAuctionBidId"
    );
  }
}

const mapper = (row: RowDataPacket): data.MakerFlipAuctionBid => {
  const extractor = rowExtractor("makerFlipAuctionBid", row);
  return {
    makerFlipAuctionBidId: extractor("makerFlipAuctionBidId"),
    makerFlipAuctionId: extractor("makerFlipAuctionId"),
    bid: extractor("bid"),
    ttl: extractor("ttl"),
    blockNumber: extractor("blockNumber"),
    timestamp: extractor("timestamp"),
    transactionHash: extractor("transactionHash"),
    sender: extractor("sender"),
  };
};
