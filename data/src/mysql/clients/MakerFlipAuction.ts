import { Pool, RowDataPacket } from "mysql2/promise";
import { rowExtractor } from "./utils";
import EntityClientBase from "./base/EntityClientBase";

export default class MakerFlipAuctionClient
  extends EntityClientBase<
    "makerFlipAuction",
    data.MakerFlipAuction,
    data.NewMakerFlipAuction
  >
  implements data.MakerFlipAuctionClient {
  public constructor(
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean
  ) {
    super(
      "makerFlipAuction",
      pool,
      logger,
      logValues,
      mapper,
      "makerFlipAuctionId"
    );
  }
}

const mapper = (row: RowDataPacket): data.MakerFlipAuction => {
  const extractor = rowExtractor("makerFlipAuction", row);
  return {
    makerFlipAuctionId: extractor("makerFlipAuctionId"),
    urnAddress: extractor("urnAddress"),
    collateralType: extractor("collateralType"),
    debt: extractor("debt"),
    liquidationPenalty: extractor("liquidationPenalty"),
    kickBlockNumber: extractor("kickBlockNumber"),
    kickTimestamp: extractor("kickTimestamp"),
    kickTransactionHash: extractor("kickTransactionHash"),
    kickSender: extractor("kickSender"),
  };
};
