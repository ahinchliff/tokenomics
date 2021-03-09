import { MakerContracts } from "../../../../core-backend/src/smart-contracts/maker/";
import { flipABI } from "../../../../core-backend/src/smart-contracts/maker/abi";
import { ethers, BigNumber } from "ethers";
import * as moment from "moment";
import { DSNoteEvent } from "./utils/event-utils";

export type FlipTendEvent = DSNoteEvent<
  "tend",
  {
    id: BigNumber;
    lot: BigNumber;
    bid: BigNumber;
  }
>;

const onMakerFlipTendEvent = async (
  event: FlipTendEvent,
  provider: ethers.providers.Provider,
  _contracts: MakerContracts,
  mysql: data.DataClients,
  _postToApi: ((event: data.MakerRevenueFromPSM) => Promise<void>) | undefined,
  t: data.IDBTransaction | undefined
) => {
  const block = await provider.getBlock(event.blockNumber);
  const transaction = await provider.getTransaction(event.transactionHash);

  const contract = new ethers.Contract(
    event.contractAddress,
    flipABI,
    provider
  );

  const ttl = await contract.ttl({ blockTag: event.blockNumber });

  await mysql.makerFlipAuctionBid.create(
    {
      blockNumber: event.blockNumber,
      makerFlipAuctionId: event.args.id.toNumber(),
      bid: Number(ethers.utils.formatUnits(event.args.bid, 45)).toFixed(2),
      ttl: ttl,
      transactionHash: event.transactionHash,
      sender: transaction.from,
      timestamp: moment.utc(moment.unix(Number(block.timestamp))).toDate(),
    },
    t
  );
};

export default onMakerFlipTendEvent;
